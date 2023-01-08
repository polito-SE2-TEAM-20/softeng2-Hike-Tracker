import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ascend, prop, sort } from 'ramda';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import {
  BaseService,
  ID,
  Point,
  UserContext,
  UserHike,
  UserHikeTrackPoint,
  UserRole,
} from '@app/common';
import { HikesService } from '@core/hikes/hikes.service';

import { UserHikeFull } from './user-hikes.interface';

@Injectable()
export class UserHikesService extends BaseService<UserHike> {
  constructor(
    @InjectRepository(UserHike)
    userHikesRepository: Repository<UserHike>,
    private hikesService: HikesService,
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
}
