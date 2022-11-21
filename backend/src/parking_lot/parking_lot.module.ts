import { Module } from '@nestjs/common';
import { ParkingLotService } from './parking_lot.service';
import { ParkingLotController } from './parking_lot.controller';

@Module({
  providers: [ParkingLotService],
  controllers: [ParkingLotController]
})
export class ParkingLotModule {}