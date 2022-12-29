import { UserHike } from '@app/common';
import { CodeHike } from '@app/common/entities/code-hike.entity';
import { HikesService } from '@core/hikes/hikes.service';
import { UserHikesService } from '@core/user-hikes/user-hikes.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { UserHikeTrackPointsService } from '@core/user-hikes/user-hike-track-points.service';
import { HikesModule } from '@core/hikes/hikes.module';
import { PointsModule } from '@core/points/points.module';


@Module({
  imports: [TypeOrmModule.forFeature([CodeHike, UserHike]), HikesModule, PointsModule],
  providers: [FriendsService, UserHikesService],
  controllers: [FriendsController],
  exports: [FriendsService],
})
export class FriendsModule {}