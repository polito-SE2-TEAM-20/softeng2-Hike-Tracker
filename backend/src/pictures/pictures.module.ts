import { Module } from '@nestjs/common';

import { UploadPathModule } from '@app/common';

import { PicturesService } from './pictures.service';

@Module({
  imports: [UploadPathModule],
  providers: [PicturesService],
  exports: [PicturesService],
})
export class PicturesModule {}
