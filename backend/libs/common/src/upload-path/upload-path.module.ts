import { Global, Module } from '@nestjs/common';

import {
  ImagesUploadPathProvider,
  UploadPathProvider,
} from './upload-path.provider';

@Module({
  providers: [UploadPathProvider, ImagesUploadPathProvider],
  exports: [UploadPathProvider, ImagesUploadPathProvider],
})
@Global()
export class UploadPathModule {}
