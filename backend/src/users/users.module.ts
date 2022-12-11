import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@app/common';
import { HikesModule } from '@core/hikes/hikes.module';
import { UserHikesModule } from '@core/user-hikes/user-hikes.module';

import { MeController } from './me.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HikesModule, UserHikesModule],
  providers: [UsersService],
  controllers: [MeController],
  exports: [UsersService],
})
export class UsersModule {}
