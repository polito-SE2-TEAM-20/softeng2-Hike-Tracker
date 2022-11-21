import { Global, Module } from '@nestjs/common';

import { UploadPathProvider } from './upload-path.provider';

@Module({
  providers: [UploadPathProvider],
  exports: [UploadPathProvider],
})
@Global()
export class UploadPathModule {}
