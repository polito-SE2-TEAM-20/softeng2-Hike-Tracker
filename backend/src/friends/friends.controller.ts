import { HikerOnly, CurrentUser, UserContext } from '@app/common';
import { Controller, HttpCode, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';


@Controller('friends')
export class FriendsController {
  constructor(private friends: FriendsService) {}


  @Post('share')
  @HikerOnly()
  @HttpCode(201)
  async shareLink(@CurrentUser() user: UserContext): Promise<string> {
    return await this.friends.shareLink(user.id);
  }





}