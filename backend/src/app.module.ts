import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppTypeormOptionsModule, AppTypeormOptionsService } from '@app/common';
import { typeormOptions } from '@app/common';

import { AuthModule } from './auth/auth.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { HikesModule } from './hikes/hikes.module';
import { PointsModule } from './points/points.module';
import { ParkingLotModule } from './parking_lot/parking_lot.module';

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
    HealthcheckModule,
    HikesModule,
    PointsModule,
    AuthModule,
    ParkingLotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
