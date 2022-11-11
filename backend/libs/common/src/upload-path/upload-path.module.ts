import { Inject, OnModuleInit } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ensureDir } from 'fs-extra';

import { UPLOAD_PATH_VALUE } from '../constants';

import { UploadPathProvider } from './upload-path.provider';

@Module({
  providers: [UploadPathProvider],
  exports: [UploadPathProvider],
})
@Global()
export class UploadPathModule implements OnModuleInit {
  constructor(@Inject(UPLOAD_PATH_VALUE) private uploadPath: string) {}

  async onModuleInit() {
    await ensureDir(this.uploadPath);
  }
}
