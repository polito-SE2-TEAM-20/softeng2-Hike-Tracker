import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AppTypeormOptionsModule,
  AppTypeormOptionsService,
  getEnvVariable,
  SERVE_FOLDER,
  STATIC_PREFIX,
  typeormOptions,
} from '@app/common';
import { AppExceptionFilter } from '@app/common/filters/app-exception.filter';

import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { HikesModule } from './hikes/hikes.module';
import { HutsModule } from './huts/huts.module';
import { ParkingLotModule } from './parking-lot/parking-lot.module';
import { PointsModule } from './points/points.module';
import { UserHikesModule } from './user-hikes/user-hikes.module';
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
    MailerModule.forRoot({
      transport: {
        host: 'in-v3.mailjet.com',
        auth: {
          user: getEnvVariable('MAILER_USER'),
          pass: getEnvVariable('MAILER_PASSWORD'),
        },
      },
    }),
    HealthcheckModule,
    AuthModule,
    HikesModule,
    PointsModule,
    AuthModule,
    ParkingLotModule,
    UsersModule,
    HutsModule,
    UserHikesModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
