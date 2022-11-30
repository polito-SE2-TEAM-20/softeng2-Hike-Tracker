import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { isTest } from '@app/common';

export function prepareApp(app: NestExpressApplication | INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    credentials: true,
  });

  if (!isTest() || true) {
    app.enableShutdownHooks();
  }

  if ('set' in app) {
    app.set('trust proxy', true);
  }
}
