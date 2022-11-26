import { InjectRepository } from '@nestjs/typeorm';
import { head, pick } from 'ramda';
import { DataSource, EntityManager, Repository } from 'typeorm';

import {
  BaseService,
  Hike,
  HikeFull,
  HikePoint,
  Hut,
  ID,
  latLonToGisPoint,
  LinkedPoint,
  ParkingLot,
  Point,
  PointType,
  StartEndPoint,
  User,
  WithPoint,
} from '@app/common';
import { PointsService } from '@core/points/points.service';

import { StartEndPointDto } from './hikes.dto';

export class HikesService extends BaseService<Hike> {
  constructor(
    @InjectRepository(Hike)
    private hikesRepository: Repository<Hike>,
    private dataSource: DataSource,
    private pointsService: PointsService,
  ) {
    super(Hike, {
      repository: hikesRepository,
      errorMessage: 'Hike not found',
    });
  }

  async validatePermissions(hike: Hike, user: User): Promise<void> {
    if (hike.userId !== user.id) {
      throw new Error('Permissions error');
    }
  }

  async getFullHike(
    hikeId: ID,
    entityManager?: EntityManager,
  ): Promise<HikeFull> {
    const query = this.getRepository(entityManager)
      .createQueryBuilder('hike')
      .where('hike.id = :hikeId', { hikeId })
      .leftJoin(HikePoint, 'hp', '(hp.hikeId = hike.id and hp.type = :type)', {
        type: PointType.referencePoint,
      })
      .leftJoinAndMapMany(
        'hike.referencePoints',
        Point,
        'p',
        'p.id = hp.pointId',
      );

    const hike = (await query.getOne()) as HikeFull;

    if (!hike) {
      throw new Error(this.errorMessage);
    }

    console.log('hike with refs', hike);

    // get linked points
    const linkedHuts = (await (entityManager || this.dataSource)
      .getRepository(Hut)
      .createQueryBuilder('h')
      .innerJoinAndMapOne('h.point', Point, 'p', 'p.id = h."pointId"')
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select(['hp.pointId'])
          .from(HikePoint, 'hp')
          .andWhere('hp.hikeId = :hikeId', { hikeId })
          .andWhere('hp.type = :type', { type: PointType.linkedPoint })
          .getQuery();

        return `h.pointId IN ${subQuery}`;
      })
      .orderBy('h.id', 'ASC')
      .getMany()) as WithPoint<Hut>[];

    const linkedParkingLots = (await (entityManager || this.dataSource)
      .getRepository(ParkingLot)
      .createQueryBuilder('pl')
      .innerJoinAndMapOne('pl.point', Point, 'p', 'p.id = pl."pointId"')
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select(['hp.pointId'])
          .from(HikePoint, 'hp')
          .andWhere('hp.hikeId = :hikeId', { hikeId })
          .andWhere('hp.type = :type', { type: PointType.linkedPoint })
          .getQuery();

        return `pl.pointId IN ${subQuery}`;
      })
      .orderBy('pl.id', 'ASC')
      .getMany()) as WithPoint<ParkingLot>[];

    const linkedPoints: LinkedPoint[] = [
      ...linkedHuts.map<LinkedPoint>((entity) => ({
        entity,
        type: 'hut',
      })),
      ...linkedParkingLots.map<LinkedPoint>((entity) => ({
        entity,
        type: 'parkingLot',
      })),
    ];

    // get start and end point
    const { endPoint, startPoint } = await this.getStartEndPoints(
      hikeId,
      entityManager,
    );

    return {
      ...hike,
      linkedPoints,
      startPoint,
      endPoint,
    };
  }

  async getStartEndPoints(
    hikeId: ID,
    entityManager?: EntityManager,
  ): Promise<
    Record<'startPoint' | 'endPoint', LinkedPoint | undefined | null>
  > {
    const startEndPoints = (await this.pointsService
      .getRepository(entityManager)
      .createQueryBuilder('p')
      .innerJoinAndMapOne(
        'p.hikePoint',
        HikePoint,
        'hp',
        '(hp.pointId = p.id and hp.hikeId = :hikeId and hp.type IN (:...types))',
        { hikeId, types: [PointType.startPoint, PointType.endPoint] },
      )
      .leftJoinAndMapOne('p.hut', Hut, 'h', 'h.pointId = p.id')
      .leftJoinAndMapOne('p.parkingLot', ParkingLot, 'pl', 'pl.pointId = p.id')
      .getMany()) as StartEndPoint[];

    const maybeStartPoint = head(
      startEndPoints.filter((p) => p.hikePoint.type === PointType.startPoint),
    );
    const maybeEndPoint = head(
      startEndPoints.filter((p) => p.hikePoint.type === PointType.endPoint),
    );

    const startPoint: LinkedPoint | null = maybeStartPoint
      ? this.composeLinkedPoint(maybeStartPoint)
      : null;
    const endPoint: LinkedPoint | null = maybeEndPoint
      ? this.composeLinkedPoint(maybeEndPoint)
      : null;

    return {
      startPoint,
      endPoint,
    };
  }

  composeLinkedPoint({
    hut,
    parkingLot,
    ...point
  }: StartEndPoint): LinkedPoint {
    if (hut) {
      return { type: 'hut', entity: { ...hut, point } };
    }
    if (parkingLot) {
      return { type: 'parkingLot', entity: { ...parkingLot, point } };
    }

    return { type: 'point', point };
  }

  /**
   * Gets the Point by hutId, parkingLotId, or just plain coords,
   * and inserts HikePoint
   */
  async upsertStartEndPoints(
    {
      id,
      endPoint,
      startPoint,
    }: {
      id: ID;
      startPoint?: StartEndPointDto | null;
      endPoint?: StartEndPointDto | null;
    },
    entityManager?: EntityManager,
  ): Promise<Array<{ point: Point; hikePoint: HikePoint }>> {
    const hikePointsRepo = (entityManager || this.dataSource).getRepository(
      HikePoint,
    );
    const result: Array<{ point: Point; hikePoint: HikePoint }> = [];

    for (const { field, type, index } of [
      { field: startPoint, type: PointType.startPoint, index: 0 },
      { field: endPoint, type: PointType.endPoint, index: 10000 },
    ]) {
      if (!field) {
        continue;
      }

      const { hutId, parkingLotId, ...rest } = field;

      let point: Point | null = null;

      console.log('we inside', type, field);
      if (hutId) {
        point = await this.pointsService
          .getPointFromJoined(
            this.pointsService.baseQuery('p', entityManager),
            Hut,
            'h',
            hutId,
          )
          .getOne();
      } else if (parkingLotId) {
        point = await this.pointsService
          .getPointFromJoined(
            this.pointsService.baseQuery('p', entityManager),
            ParkingLot,
            'pl',
            parkingLotId,
          )
          .getOne();
      } else {
        // the starting point is just name/addr/pos
        point = await this.pointsService.create(
          {
            ...pick(['address', 'name'], rest),
            position: latLonToGisPoint(rest),
            type: PointType.point,
          },
          entityManager,
        );
      }

      console.log(type, point);

      if (!point) {
        continue;
      }

      // remove existing HikePoint
      await hikePointsRepo.delete({
        hikeId: id,
        type,
      });

      // save new HikePoint
      const hikePoint = await hikePointsRepo.save({
        type,
        index,
        hikeId: id,
        pointId: point.id,
      });

      console.log('created hike point', type, point);

      result.push({ hikePoint, point });
    }

    return result;
  }
}
