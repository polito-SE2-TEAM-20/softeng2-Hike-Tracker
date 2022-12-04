import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  HttpCode,
  Param,
  ForbiddenException,
  Put,
} from '@nestjs/common';

import {
  AuthenticatedOnly,
  CurrentUser,
  UserContext,
  UserRole,
  PlatformManagerOnly,
} from '@app/common';

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
    if (body.role === UserRole.friend) {
      throw new ForbiddenException('Friend is not a valid role to register');
    }

    if (body.role !== UserRole.hiker && !body.phoneNumber) {
      throw new ForbiddenException('Phone Number for this role is required');
    }

    if (body.role === UserRole.platformManager) {
      throw new ForbiddenException(
        'Platform Manager is not a valid role to register',
      );
    }

    if (body.role === UserRole.hutWorker && !body.hutIds) {
      throw new ForbiddenException(
        'As an hut worker you need to specify in which hut you will work',
      );
    }

    if (body.role !== UserRole.hutWorker && !!body.hutIds) {
      throw new ForbiddenException('Only a hut worker needs to choose a hut');
    }

    return await this.service.register(body);
  }

  @Put('approve_user/:id')
  @PlatformManagerOnly()
  @HttpCode(204)
  async approveUser(@Param('id') id: number) {
    return await this.service.approveUser(id);
  }

  @Get('verify/:hash')
  @HttpCode(200)
  async verifyMail(@Param('hash') hash: string) {
    return await this.service.validateRegistration(hash);
  }

  @Get('not_approved/local_guides')
  @PlatformManagerOnly()
  @HttpCode(200)
  async retrieveNotApprovedLocalGuides() {
    return await this.service.retrieveNotApprovedLocalGuides();
  }

  @Get('not_approved/hut_workers')
  @PlatformManagerOnly()
  @HttpCode(200)
  async retrieveNotApprovedHutWorkers() {
    return await this.service.retrieveNotApprovedHutWorkers();
  }

  @AuthenticatedOnly()
  @Get('me')
  async me(@CurrentUser() user: UserContext) {
    return user;
  }
}
