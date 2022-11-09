import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { entities } from '@app/common';

import { HikesModule } from './hikes/hikes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? +process.env.DB_PORT : undefined,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities,
      connectTimeoutMS: 14 * 1000,
      extra: {
        max: 5,
        connectionTimeoutMillis: 30 * 1000,
        idleTimeoutMillis: 20 * 1000,
      },
      logging: !!process.env.SQL_LOGGING ? true : ['error'],
      synchronize: !!process.env.SYNCHRONIZE,
    }),
    HikesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
