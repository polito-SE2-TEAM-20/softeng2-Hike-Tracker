import { InjectRepository } from '@nestjs/typeorm';
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
  User,
  WithPoint,
} from '@app/common';

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

    return {
      ...hike,
      linkedPoints,
    };
  }
}
