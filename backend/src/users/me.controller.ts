import { Controller, Get } from '@nestjs/common';

import { AuthenticatedOnly, CurrentUser, Hike, UserContext } from '@app/common';
import { HikesService } from '@core/hikes/hikes.service';

@Controller('me')
@AuthenticatedOnly()
export class MeControlelr {
  constructor(private hikesService: HikesService) {}

  @Get('hikes')
  async myHikes(@CurrentUser() user: UserContext): Promise<Hike[]> {
    return await this.hikesService
      .getRepository()
      .createQueryBuilder('h')
      .andWhere('h.userId = :userId', { userId: user.id })
      .orderBy('h.id', 'DESC')
      .getMany();
  }
}
