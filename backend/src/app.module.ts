import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AppTypeormOptionsModule,
  AppTypeormOptionsService,
  SERVE_FOLDER,
  STATIC_PREFIX,
} from '@app/common';
import { typeormOptions } from '@app/common';

import { AuthModule } from './auth/auth.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { HikesModule } from './hikes/hikes.module';
import { HutsModule } from './huts/huts.module';
import { PointsModule } from './points/points.module';
import { UsersModule } from './users/users.module';

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
      rootPath: SERVE_FOLDER,
      serveRoot: `/${STATIC_PREFIX}`,
    }),

    HealthcheckModule,
    AuthModule,
    HikesModule,
    PointsModule,
    UsersModule,
    HutsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
