import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ascend, prop, sort } from 'ramda';
import { EntityManager, Repository } from 'typeorm';

import {
  BaseService,
  ID,
  UserContext,
  UserHike,
  UserHikeTrackPoint,
} from '@app/common';

import { UserHikeFull } from './user-hikes.interface';

@Injectable()
export class UserHikesService extends BaseService<UserHike> {
  constructor(
    @InjectRepository(UserHike)
    private userHikesRepository: Repository<UserHike>,
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

    if (user.id !== userHike.id) {
      throw new ForbiddenException('Cannot track to another user hike');
    }

    return userHike;
  }

  async getFullUserHike(
    id: ID,
    entityManager?: EntityManager,
  ): Promise<UserHikeFull> {
    const userHike = (await this.getRepository(entityManager)
      .createQueryBuilder('uh')
      .leftJoinAndMapMany(
        'uh.trackPoints',
        UserHikeTrackPoint,
        'uhtp',
        'uhtp.userHikeId = uh.id',
      )
      .getOne()) as UserHikeFull | null;

    if (!userHike) {
      throw new Error(this.errorMessage);
    }

    userHike.trackPoints = sort(
      ascend(prop('index')),
      userHike.trackPoints || [],
    );

    return userHike;
  }
}
