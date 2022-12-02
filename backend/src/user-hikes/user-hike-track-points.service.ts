import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseCompositeKeyService, UserHikeTrackPoint } from '@app/common';

export class UserHikeTrackPointsService extends BaseCompositeKeyService<
  UserHikeTrackPoint,
  'userHikeId' | 'index'
> {
  constructor(
    @InjectRepository(UserHikeTrackPoint)
    userHikeTrackPointsRepository: Repository<UserHikeTrackPoint>,
  ) {
    super(UserHikeTrackPoint, {
      repository: userHikeTrackPointsRepository,
      errorMessage: 'UserHikeTrackPoint not found',
    });
  }
}
