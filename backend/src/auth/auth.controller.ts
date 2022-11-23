import {
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Body,
  HttpCode,
  Param,
  HttpException
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
    if(body.role === 1)
      throw new HttpException("Friend is not a valid role to register",403)
    if(body.role !==0 && (body.phoneNumber === null || body.phoneNumber === undefined))
      throw new HttpException("Phone Number for this role is required",403)
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
