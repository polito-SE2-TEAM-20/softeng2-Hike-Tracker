import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Hut,
  imagesUploadStorage,
  IMAGES_UPLOAD_PATH_VALUE,
  Point,
  UploadPathModule,
} from '@app/common';
import { PicturesModule } from '@core/pictures/pictures.module';

import { HutPicturesController } from './hut-pictures.controller';
import { HutsController } from './huts.controller';
import { HutsService } from './huts.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [IMAGES_UPLOAD_PATH_VALUE],
      useFactory: (dest: string) => {
        return {
          dest,
          limits: {
            fileSize: 1024 * 1024 * 25,
          },
          storage: imagesUploadStorage,
        };
      },
      imports: [UploadPathModule],
    }),
    TypeOrmModule.forFeature([Hut, Point]),
    PicturesModule,
  ],
  providers: [HutsService],
  controllers: [HutsController, HutPicturesController],
  exports: [HutsService],
})
export class HutsModule {}
