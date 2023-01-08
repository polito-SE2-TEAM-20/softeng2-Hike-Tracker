import { HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  BaseCompositeKeyService,
  UserHikeTrackPoint,
  UserHike,
} from '@app/common';

import { UserHikeFull } from './user-hikes.interface';
import { UserHikesService } from './user-hikes.service';

export class UserHikeTrackPointsService extends BaseCompositeKeyService<
  UserHikeTrackPoint,
  'userHikeId' | 'index'
> {
  constructor(
    @InjectRepository(UserHikeTrackPoint)
    userHikeTrackPointsRepository: Repository<UserHikeTrackPoint>,
    @InjectRepository(UserHike)
    private userHikesRepository: Repository<UserHike>,
    private userHikesService: UserHikesService,
  ) {
    super(UserHikeTrackPoint, {
      repository: userHikeTrackPointsRepository,
      errorMessage: 'UserHikeTrackPoint not found',
    });
  }

  async getReachedReferencePoints(userId: number): Promise<UserHikeFull> {
    const userHike = await this.userHikesRepository
      .createQueryBuilder('uh')
      .where('uh.userId = :userId', { userId })
      .andWhere('uh.finishedAt IS NULL')
      .getOne();

    if (userHike === null) throw new HttpException('Hike not found', 422);

    if (!!userHike.finishedAt) {
      throw new BadRequestException('Hike is finished');
    }

    return await this.userHikesService.getFullUserHike(userHike.id);
  }
}
