import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthenticatedOnly, CurrentUser, Hike, UserContext } from '@app/common';
import { HikesService } from '@core/hikes/hikes.service';
import { PreferencesDto } from './preferences.dto';
import { UsersService } from './users.service';

@Controller('me')
@AuthenticatedOnly()
export class MeControlelr {
  constructor(private hikesService: HikesService, private usersService: UsersService) {}

  @Get('hikes')
  async myHikes(@CurrentUser() user: UserContext): Promise<Hike[]> {
    return await this.hikesService
      .getRepository()
      .createQueryBuilder('h')
      .andWhere('h.userId = :userId', { userId: user.id })
      .orderBy('h.id', 'DESC')
      .getMany();
  }

  @AuthenticatedOnly()
  @Get('preferences')
  async getPreferences(@CurrentUser() user: UserContext) {
    return await this.usersService.getPreferences(user.id);
  }

  @AuthenticatedOnly()
  @Post('set_preferences')
  async setPreferences(@CurrentUser() user: UserContext, @Body() body: PreferencesDto) {
    return await this.usersService.setPreferences(user.id, body);
  }

}
