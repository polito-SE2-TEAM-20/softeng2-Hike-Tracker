import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  HttpException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ascend, prop, sort } from 'ramda';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { PointsService } from '@core/points/points.service';
import {
  BaseService,
  ID,
  Point,
  UserContext,
  UserHike,
  UserHikeReference,
  UserHikeTrackPoint,
  UserRole,
  HikePoint,
  PointType
} from '@app/common';
import { HikesService } from '@core/hikes/hikes.service';

import { UserHikeFull } from './user-hikes.interface';

@Injectable()
export class UserHikesService extends BaseService<UserHike> {
  constructor(
    @InjectRepository(UserHike)
    private userHikesRepository: Repository<UserHike>,
    private hikesService: HikesService,
    @InjectRepository(UserHikeReference)
    private userHikeReference: Repository<UserHikeReference>,
    private pointsService: PointsService,
  ) {
    super(UserHike, {
      repository: userHikesRepository,
      errorMessage: 'UserHike not found',
    });
  }

  async findByIdAndValidatePermissions(
    id: ID,
    user: UserContext,
  ): Promise<UserHike> {
    const userHike = await this.findByIdOrThrow(id);

    if (
      user.id !== userHike.userId &&
      ![UserRole.emergencyOperator, UserRole.platformManager].includes(
        user.role,
      )
    ) {
      throw new ForbiddenException('Cannot track to another user hike');
    }

    return userHike;
  }

  async getFullUserHike(
    id: ID,
    entityManager?: EntityManager,
  ): Promise<UserHikeFull> {
    const userHike = (await this.buildFullUserHikesQuery(
      this.getRepository(entityManager)
        .createQueryBuilder('uh')
        .andWhere('uh.id = :id', { id }),
    ).getOne()) as UserHikeFull | null;

    // console.log(userHike);
    // console.log(userHike?.trackPoints[0]);

    if (!userHike) {
      throw new NotFoundException(this.errorMessage);
    }

    userHike.trackPoints = sort(ascend(prop('index')), userHike.trackPoints);
    userHike.hike = await this.hikesService.getFullHike(userHike.hikeId);

    return userHike;
  }

  /**
   * Left join with user hike track points
   */
  buildFullUserHikesQuery(query: SelectQueryBuilder<UserHike>): typeof query {
    query
      .leftJoinAndMapMany(
        'uh.trackPoints',
        UserHikeTrackPoint,
        'uhtp',
        `uhtp.userHikeId = ${query.alias}.id`,
      )
      .leftJoinAndMapOne('uhtp.point', Point, 'p', 'p.id = uhtp.pointId')
      .orderBy('uhtp.index', 'ASC');

    return query;
  }

  async reachReferencePoint(userId: number, pointId: number) {

    const userHike = await this.userHikesRepository
    .createQueryBuilder('uh')
    .where('uh.userId = :userId', {userId})
    .andWhere('uh.finishedAt IS NULL')
    .getOne()

    if(userHike === null) throw new HttpException("Hike not found",422);

    //const hike = await this.hikesService.getFullHike(userHike.hikeId);

    if (!!userHike.finishedAt) {
      throw new BadRequestException('Hike is finished');
    }

    const point = await this.pointsService.findByIdOrThrow(pointId);
    // ensure such reference point exists
    // const referenceCount = await this.pointsService
    //   .getRepository()
    //   .createQueryBuilder('p')
    //   .innerJoin(
    //     HikePoint,
    //     'hp',
    //     '(hp.pointId = p.id and hp.type = :type and hp.hikeId = :hikeId)',
    //     { type: PointType.referencePoint, hikeId: userHike.hikeId },
    //   )
    //   .andWhere('p.id = :pointId', { pointId })
    //   .getCount();

    // if (!referenceCount) {
    //   throw new BadRequestException(
    //     'This point is not a reference point for this hike',
    //   );
    // }

    await this.userHikeReference.save({
      userHikeId: userHike.id,
      pointId: pointId
    })

    return point
  }

  async getReachenReferencePoints(userId: number) {
    
    const userHike = await this.userHikesRepository
    .createQueryBuilder('uh')
    .where('uh.userId = :userId', {userId})
    .andWhere('uh.finishedAt IS NULL')
    .getOne()

    if(userHike === null) throw new HttpException("Hike not found",422);

    if (!!userHike.finishedAt) {
      throw new BadRequestException('Hike is finished');
    }

    const rawReachenPoints = await this.userHikeReference.findBy({userHikeId: userHike.id});

    const reachenPoints: Promise<Point>[] =  rawReachenPoints.map(async (p) => {
      console.log(p)
      const np = await this.pointsService.findByIdOrThrow(p.pointId)
      console.log(np)
      return np
    }) 

    return reachenPoints;
  }
}
