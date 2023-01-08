import { Controller, HttpCode, Post, Get, Param } from '@nestjs/common';

import { HikerOnly, CurrentUser, UserContext } from '@app/common';
import { UserHikeFull } from '@core/user-hikes/user-hikes.interface';

import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private friends: FriendsService) {}

  @Post('share')
  @HikerOnly()
  @HttpCode(201)
  async shareLink(@CurrentUser() user: UserContext): Promise<{ Code: string }> {
    return await this.friends.shareLink(user.id);
  }

  @Get('track/:code')
  @HttpCode(200)
  async trackFriend(@Param('code') code: string): Promise<UserHikeFull> {
    return await this.friends.getFriendHike(code);
  }
}
