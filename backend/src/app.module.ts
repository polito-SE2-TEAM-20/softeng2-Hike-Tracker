import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppTypeormOptionsModule, AppTypeormOptionsService } from '@app/common';
import { typeormOptions } from '@app/common';

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
    HikesModule,
    PointsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
