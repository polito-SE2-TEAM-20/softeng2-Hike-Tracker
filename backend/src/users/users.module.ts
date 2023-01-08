import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hike, User } from '@app/common';
import { HikesModule } from '@core/hikes/hikes.module';
import { UserHikesModule } from '@core/user-hikes/user-hikes.module';

import { MeController } from './me.controller';
import { UsersStatsService } from './users-stats.service';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Hike]),
    HikesModule,
    UserHikesModule,
  ],
  providers: [UsersService, UsersStatsService],
  controllers: [MeController],
  exports: [UsersService],
})
export class UsersModule {}
