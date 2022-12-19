import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Hike,
  UploadPathModule,
  uploadStorage,
  UPLOAD_PATH_VALUE,
} from '@app/common';
import { GpxModule } from '@app/gpx';
import { PicturesModule } from '@core/pictures/pictures.module';

import { PointsModule } from '../points/points.module';

import { HikeModificationController } from './hike-modification.controller';
import { HikePicturesController } from './hike-pictures.controller';
import { HikesController } from './hikes.controller';
import { HikesService } from './hikes.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [UPLOAD_PATH_VALUE],
      useFactory: (UPLOAD_PATH: string) => {
        return {
          dest: UPLOAD_PATH,
          limits: {
            fileSize: 1024 * 1024 * 50,
          },
          storage: uploadStorage,
        };
      },
      imports: [UploadPathModule],
    }),
    TypeOrmModule.forFeature([Hike]),
    GpxModule,
    PointsModule,
    PicturesModule,
  ],
  controllers: [
    HikesController,
    HikeModificationController,
    HikePicturesController,
  ],
  providers: [HikesService],
  exports: [HikesService],
})
export class HikesModule {}
