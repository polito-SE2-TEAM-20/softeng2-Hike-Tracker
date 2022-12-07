/* istanbul ignore file */

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ensureDir } from 'fs-extra';

import { isTest, UPLOAD_PATH } from '@app/common';

import { AppModule } from './app.module';
import { prepareApp } from './prepare-app';

async function bootstrap() {
  console.log({ UPLOAD_PATH });
  if (isTest()) {
    console.log('ensuring that', UPLOAD_PATH, 'exists');
    await ensureDir(UPLOAD_PATH, { mode: 0o777 });
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3500;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  prepareApp(app);

  await app.listen(port);

  console.log('Backend started on', port);
}

bootstrap().catch((error) => {
  console.error('Error on startup', error);

  process.exit(1);
});
