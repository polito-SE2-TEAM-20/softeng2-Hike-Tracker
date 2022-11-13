import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
  HttpCode,
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
    @Request() req: any,
  ): Promise<{ token: string; user: UserContext }> {
    return await this.service.login(req.user);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterDto): Promise<UserContext> {
    return await this.service.register(body);
  }

  @AuthenticatedOnly()
  @Get('me')
  async me(@CurrentUser() user: UserContext) {
    return user;
  }
}
