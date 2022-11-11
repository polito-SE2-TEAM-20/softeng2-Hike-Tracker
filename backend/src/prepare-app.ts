import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { isTest } from '@app/common';

export function prepareApp(app: NestExpressApplication | INestApplication) {
  if (!isTest()) {
    app.enableShutdownHooks();
  }

  app.enableCors({
    credentials: true,
  });

  if ('set' in app) {
    app.set('trust proxy', true);
  }
}
