import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParkingLot, Point } from '@app/common';

import { ParkingLotController } from './parking_lot.controller';
import { ParkingLotService } from './parking_lot.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLot, Point])],
  providers: [ParkingLotService],
  controllers: [ParkingLotController],
  exports: [ParkingLotService],
})
export class ParkingLotModule {}
