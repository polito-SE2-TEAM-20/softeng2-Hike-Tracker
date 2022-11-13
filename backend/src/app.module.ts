import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AppTypeormOptionsModule,
  AppTypeormOptionsService,
  STATIC_PREFIX,
  UPLOAD_PATH,
} from '@app/common';
import { typeormOptions } from '@app/common';

import { AuthModule } from './auth/auth.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { HikesModule } from './hikes/hikes.module';
import { PointsModule } from './points/points.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        AppTypeormOptionsModule.forRoot({
          ...typeormOptions,
        }),
      ],
      useExisting: AppTypeormOptionsService,
    }),
    ServeStaticModule.forRoot({
      rootPath: UPLOAD_PATH,
      serveRoot: `/${STATIC_PREFIX}`,
    }),

    HealthcheckModule,
    HikesModule,
    PointsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
