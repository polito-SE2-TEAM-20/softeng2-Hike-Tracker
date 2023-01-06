import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserHike } from '@app/common';
import { CodeHike } from '@app/common/entities/code-hike.entity';
import { HikesModule } from '@core/hikes/hikes.module';
import { PointsModule } from '@core/points/points.module';
import { UserHikesService } from '@core/user-hikes/user-hikes.service';

import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CodeHike, UserHike]),
    HikesModule,
    PointsModule,
  ],
  providers: [FriendsService, UserHikesService],
  controllers: [FriendsController],
  exports: [FriendsService],
})
export class FriendsModule {}
