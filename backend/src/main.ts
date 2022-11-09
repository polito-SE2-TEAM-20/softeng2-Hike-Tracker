import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3500;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    credentials: true,
  });

  await app.listen(port);

  console.log('Backend started on', port);
}

bootstrap().catch((error) => {
  console.error('Error on startup', error);

  process.exit(1);
});
