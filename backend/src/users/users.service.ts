import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService, User } from '@app/common';

export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super(User, {
      repository: usersRepository,
      errorMessage: 'User not found',
    });
  }
}
