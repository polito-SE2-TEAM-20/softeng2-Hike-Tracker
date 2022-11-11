import { Controller, Get, Post, Request, UseGuards, Body } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AuthenticatedOnly, CurrentUser, UserJwtPayload } from 'libs/common/src';
import { User } from 'libs/common/src/entities/user.entity';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService, private dataSource: DataSource) {
    // skip
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: any,
  ): Promise<{ token: string } & Pick<User, 'email' | 'role'>> {
    return await this.service.login(req.user);
  }

  @Post('register')
  async register(@Body() b:any) {
    return await this.service.register(b)
  }

  @AuthenticatedOnly()
  @Get('me')
  async me(@CurrentUser() user: UserJwtPayload) {
    return user;
  }
}
