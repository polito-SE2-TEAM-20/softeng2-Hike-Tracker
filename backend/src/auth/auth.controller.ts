import {
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Body,
  HttpCode,
  Param
} from '@nestjs/common';

import { AuthenticatedOnly, CurrentUser, UserContext } from '@app/common';

import { RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @CurrentUser() user: UserContext,
  ): Promise<{ token: string; user: UserContext }> {
    return await this.service.login(user);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterDto): Promise<UserContext> {
    if(body.role == 1)
      throw new Error("Friend is not a valid role to register")
    return await this.service.register(body);
  }

  @Put('verify/:hash')
  @HttpCode(200)
  async verifyMail(@Param('hash') hash: string) {
    return await this.service.validateRegistration(hash);
  }

  @AuthenticatedOnly()
  @Get('me')
  async me(@CurrentUser() user: UserContext) {
    return user;
  }

}
