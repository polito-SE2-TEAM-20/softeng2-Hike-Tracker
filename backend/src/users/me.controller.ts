import { Body, Controller, Get } from '@nestjs/common';

import {
  AuthenticatedOnly,
  CurrentUser,
  Hike,
  UserContext,
  UserHikeState,
} from '@app/common';
import { HikesService } from '@core/hikes/hikes.service';
import { UserHikeFull } from '@core/user-hikes/user-hikes.interface';
import { UserHikesService } from '@core/user-hikes/user-hikes.service';

import { MyTrackedHikesDto } from './me.dto';

@Controller('me')
@AuthenticatedOnly()
export class MeControlelr {
  constructor(
    private hikesService: HikesService,
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

  @Get('tracked-hikes')
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
}
