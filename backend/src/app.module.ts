import { MailerModule } from '@nestjs-modules/mailer';
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
import { ParkingLotModule } from './parking_lot/parking_lot.module';
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
    MailerModule.forRoot({
      transport: {
        host: 'in-v3.mailjet.com',
        auth: {
          user: '47db18f553e8840696f204e9b37b6978',
          pass: '45ad1cf87fb6d35d829c4a6a449cda0f',
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
