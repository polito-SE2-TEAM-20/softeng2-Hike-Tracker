import { InjectRepository } from '@nestjs/typeorm';
import { head } from 'ramda';
import { DataSource, EntityManager, Repository } from 'typeorm';

import {
  BaseService,
  Hike,
  HikeFull,
  HikePoint,
  Hut,
  ID,
  LinkedPoint,
  ParkingLot,
  Point,
  PointType,
  StartEndPoint,
  User,
  WithPoint,
} from '@app/common';

import { LinkedPointDto } from './hikes.dto';

export class HikesService extends BaseService<Hike> {
  constructor(
    @InjectRepository(Hike)
    private hikesRepository: Repository<Hike>,
    private dataSource: DataSource,
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
    const startEndPoints = (await (entityManager || this.dataSource)
      .getRepository(Point)
      .createQueryBuilder('p')
      .innerJoinAndMapOne('p.hikePoint', HikePoint, 'hp', 'hp.pointId = p.id')
      .getMany()) as StartEndPoint[];

    const startPoint = head(
      startEndPoints.filter((p) => p.hikePoint.type === PointType.startPoint),
    );
    const endPoint = head(
      startEndPoints.filter((p) => p.hikePoint.type === PointType.endPoint),
    );

    return {
      ...hike,
      linkedPoints,
      startPoint,
      endPoint,
    };
  }

  async updateStartEndPoints({
    id,
    endPoint,
    startPoint,
  }: {
    id: ID;
    startPoint?: LinkedPointDto | null;
    endPoint?: LinkedPointDto | null;
  }): Promise<void> {
    for (const { field, type } of [
      { field: startPoint, type: PointType.startPoint },
      { field: endPoint, type: PointType.startPoint },
    ]) {
      if (!field) {
        continue;
      }

      const { hutId, parkingLotId } = field;

      let point: Point | null = null;

      if (hutId) {
        point = await this.dataSource
          .getRepository(Point)
          .createQueryBuilder('p')
          .andWhere((qb) => {
            const subQuery = qb
              .subQuery()
              .select(['h.pointId'])
              .from(Hut, 'h')
              .andWhere('h.id = :hutId', {
                hutId,
              })
              .getQuery();

            return `p.id IN ${subQuery}`;
          })
          .getOne();
      } else if (parkingLotId) {
        point = await this.dataSource
          .getRepository(Point)
          .createQueryBuilder('p')
          .andWhere((qb) => {
            const subQuery = qb
              .subQuery()
              .select(['pl.pointId'])
              .from(ParkingLot, 'pl')
              .andWhere('pl.id :parkingLotId', {
                parkingLotId,
              })
              .getQuery();

            return `p.id IN ${subQuery}`;
          })
          .getOne();
      }

      if (!point) {
        continue;
      }

      // remove existing point
      await this.dataSource.getRepository(HikePoint).delete({
        hikeId: id,
        type,
      });

      // save new start point
      await this.dataSource
        .getRepository(HikePoint)
        .save({ index: 1, hikeId: id, pointId: point.id, type });
    }
  }
}
