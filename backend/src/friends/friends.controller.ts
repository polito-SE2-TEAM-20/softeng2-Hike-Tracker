import { HikerOnly, CurrentUser, UserContext } from '@app/common';
import { Controller, HttpCode, Post, Get, Param } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { UserHikeFull } from '@core/user-hikes/user-hikes.interface';
import { UserHikeReference } from '@app/common';


@Controller('friends')
export class FriendsController {
  constructor(private friends: FriendsService) {}


  @Post('share')
  @HikerOnly()
  @HttpCode(201)
  async shareLink(@CurrentUser() user: UserContext): Promise<Object> {
    return await this.friends.shareLink(user.id);
  }

  @Get('track/:code')
  @HttpCode(200)
  async trackFriend(@Param('code') code:string): Promise<UserHikeFull> {
    return await this.friends.getFriendHike(code);
  }

  @Get('reached-points/:code')
  @HttpCode(200)
  async getFriendReachedReferencePoints(@Param('code') code:string): Promise<UserHikeReference[]> {
    return await this.friends.getFriendReachedReferencePoints(code);
  }


}