import { HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { BaseService, User } from '@app/common';
import { Hike } from '@app/common';

import { PlannedHikesDto } from './me.dto';
import { PreferencesDto } from './preferences.dto';

export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Hike)
    private hikesRepository: Repository<Hike>,
  ) {
    super(User, {
      repository: usersRepository,
      errorMessage: 'User not found',
    });
  }

  async setPreferences(
    id: number,
    body: PreferencesDto,
  ): Promise<PreferencesDto> {
    let user = await this.usersRepository.findOneBy({ id });

    if (user === null) throw new HttpException("User doesn't exists", 422);

    user = await this.usersRepository.save({
      ...user,
      preferences: {
        lat: body.lat,
        lon: body.lon,
        radiusKms: body.radiusKms,
        minLength: body.minLength,
        maxLength: body.maxLength,
        expectedTimeMin: body.expectedTimeMin,
        expectedTimeMax: body.expectedTimeMax,
        difficultyMin: body.difficultyMin,
        difficultyMax: body.difficultyMax,
        ascentMax: body.ascentMax,
        ascentMin: body.ascentMin,
        suggestionType: body.suggestionType,
      },
    });
    return user.preferences;
  }

  async getPreferences(id: number): Promise<PreferencesDto> {
    const user = await this.usersRepository.findOneBy({ id });

    if (user === null) throw new HttpException("User doesn't exists", 422);

    if (user.preferences === null)
      throw new HttpException('You still need to set your preferences', 404);

    return user.preferences;
  }

  async setPlannedHike(id: number, body: PlannedHikesDto): Promise<Hike[]> {
    let user = await this.usersRepository.findOneBy({ id });

    if (user === null) throw new HttpException("User doesn't exists", 422);

    if (body.plannedHikes) {
      for (const ph of body.plannedHikes) {
        const hike = await this.hikesRepository.findOneBy({ id: ph });
        if (hike === null)
          throw new HttpException('Hike with id ' + ph + " doesn't exist", 422);
      }
    }

    if (user.plannedHikes !== null) {
      let plannedHikes = user.plannedHikes.concat(body.plannedHikes!);
      const set = new Set(plannedHikes);
      plannedHikes = Array.from(set);

      user = await this.usersRepository.save({
        ...user,
        plannedHikes,
      });
    } else {
      user = await this.usersRepository.save({
        ...user,
        plannedHikes: body.plannedHikes,
      });
    }

    return await this.hikesRepository.findBy({ id: In(user.plannedHikes) });
  }

  async getPlannedHikes(id: number): Promise<Hike[]> {
    const user = await this.usersRepository.findOneBy({ id });

    if (user === null) throw new HttpException("User doesn't exists", 422);

    if (user.plannedHikes === null || user.plannedHikes.length === 0)
      throw new HttpException('You have still not planned any hike', 404);

    return await this.hikesRepository.findBy({ id: In(user.plannedHikes) });
  }

  async removePlannedHike(id: number, body: PlannedHikesDto): Promise<void> {
    let user = await this.usersRepository.findOneBy({ id });

    if (user === null) throw new HttpException("User doesn't exists", 422);

    const isPlannedHike = body.plannedHikes!.every((ph) => {
      return user!.plannedHikes.includes(ph);
    });
    if (!isPlannedHike)
      throw new HttpException(
        'An hike you want to delete was not planned by the user',
        422,
      );

    const newPlannedHikes = user.plannedHikes.filter((ph) => {
      return body.plannedHikes!.every((uph) => {
        return ph !== uph;
      });
    });

    user = await this.usersRepository.save({
      ...user,
      plannedHikes: newPlannedHikes,
    });
  }
}
