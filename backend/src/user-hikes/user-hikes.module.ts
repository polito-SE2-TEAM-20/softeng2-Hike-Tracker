import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserHike, UserHikeTrackPoint } from '@app/common';
import { HikesModule } from '@core/hikes/hikes.module';
import { PointsModule } from '@core/points/points.module';

import { UserHikeTrackPointsService } from './user-hike-track-points.service';
import { UserHikesController } from './user-hikes.controller';
import { UserHikesService } from './user-hikes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserHike, UserHikeTrackPoint]),
    HikesModule,
    PointsModule,
  ],
  controllers: [UserHikesController],
  providers: [UserHikesService, UserHikeTrackPointsService],
  exports: [UserHikesService, UserHikeTrackPointsService],
})
export class UserHikesModule {}
