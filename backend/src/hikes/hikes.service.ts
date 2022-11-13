import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService, Hike, User } from '@app/common';

export class HikesService extends BaseService<Hike> {
  constructor(
    @InjectRepository(Hike)
    private hikesRepository: Repository<Hike>,
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
}
