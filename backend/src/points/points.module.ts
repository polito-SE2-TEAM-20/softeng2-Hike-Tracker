import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Point } from '@app/common';

import { PointsService } from './points.service';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}
