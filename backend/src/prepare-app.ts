/* istanbul ignore file */

import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { GroupValidationPipe, isTest } from '@app/common';

export function prepareApp(app: NestExpressApplication | INestApplication) {
  app.useGlobalPipes(
    new GroupValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    credentials: true,
  });

  if (!isTest()) {
    app.enableShutdownHooks();
  }

  if ('set' in app) {
    app.set('trust proxy', true);
  }
}
