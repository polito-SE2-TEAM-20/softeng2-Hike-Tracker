import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { BaseService, User } from '@app/common';
import { PreferencesDto } from './preferences.dto';

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

  async setPreferences(id: number, body: PreferencesDto): Promise<PreferencesDto> {
    let user = await this.usersRepository.findOneBy({ id })

    if (user === null) 
      throw new HttpException("User doesn't exists", 422);

    user = await this.usersRepository.save({
      ...user,
      preferences: {
        lat: body.lat,
        lon: body.lon,
        radiusKms: body.radiusKms,
        length: body.length,
        expectedTime: body.expectedTime,
        difficulty: body.difficulty,
        ascent: body.ascent
      }
    })
    return user.preferences
  }

  async getPreferences(id: number) {
    const user = await this.usersRepository.findOneBy({ id })

    if (user === null) 
      throw new HttpException("User doesn't exists", 422);

    if (user.preferences === null) 
      throw new HttpException("You still need to set your preferences", 422);

    return user.preferences
  }
}
