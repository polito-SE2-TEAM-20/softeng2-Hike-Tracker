import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import {
  AuthenticatedOnly,
  CurrentUser,
  Hike,
  UserContext,
  UserHikeState,
} from '@app/common';
import { HikerOnly } from '@app/common';
import { HikesService } from '@core/hikes/hikes.service';
import { UserHikeFull } from '@core/user-hikes/user-hikes.interface';
import { UserHikesService } from '@core/user-hikes/user-hikes.service';
import { HikesController } from '@core/hikes/hikes.controller';

import { MyTrackedHikesDto } from './me.dto';
import { PreferencesDto } from './preferences.dto';
import { UsersService } from './users.service';
import { FilteredHikesDto } from '@core/hikes/hikes.dto';

@Controller('me')
@AuthenticatedOnly()
export class MeController {
  constructor(
    private hikesService: HikesService,
    private usersService: UsersService,
    private userHikesService: UserHikesService,
  ) {}

  @Get('hikes')
  async myHikes(@CurrentUser() user: UserContext): Promise<Hike[]> {
    return await this.hikesService
      .getRepository()
      .createQueryBuilder('h')
      .andWhere('h.userId = :userId', { userId: user.id })
      .orderBy('h.id', 'DESC')
      .getMany();
  }

  @Post('tracked-hikes')
  @HttpCode(HttpStatus.OK)
  async myTrackedHikes(
    @CurrentUser() user: UserContext,
    @Body() { state }: MyTrackedHikesDto,
  ): Promise<UserHikeFull[]> {
    const query = this.userHikesService.buildFullUserHikesQuery(
      this.userHikesService
        .getRepository()
        .createQueryBuilder('uh')
        .andWhere('uh.userId = :userId', { userId: user.id }),
    );

    if (state === UserHikeState.active) {
      query.andWhere('uh.finishedAt is null');
    }
    if (state === UserHikeState.finished) {
      query.andWhere('uh.finishedAt is not null');
    }

    query.orderBy('uh.id', 'DESC');

    const userHikesFull = (await query.getMany()) as UserHikeFull[];

    return userHikesFull;
  }
  @HikerOnly()
  @HttpCode(200)
  @Get('preferences')
  async getPreferences(@CurrentUser() user: UserContext): Promise<PreferencesDto> {
    return await this.usersService.getPreferences(user.id);
  }

  @HikerOnly()
  @HttpCode(201)
  @Post('set_preferences')
  async setPreferences(
    @CurrentUser() user: UserContext,
    @Body() body: PreferencesDto,
  ): Promise<PreferencesDto> {
    return await this.usersService.setPreferences(user.id, body);
  }

  @HikerOnly()
  @HttpCode(200)
  @Get('apply_preferences')
  async applyPreferences(@CurrentUser() user: UserContext): Promise<Hike[]> {
    const preferences = await this.usersService.getPreferences(user.id);

    return await this.hikesService.getFilteredHikes({...preferences, inPointRadius: {lat: preferences.lat, lon: preferences.lon, radiusKms: preferences.radiusKms}});
  }
}
