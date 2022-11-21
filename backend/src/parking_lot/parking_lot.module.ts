import { Module } from '@nestjs/common';
import { ParkingLotService } from './parking_lot.service';
import { ParkingLotController } from './parking_lot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingLot } from '@app/common';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLot])],
  providers: [ParkingLotService],
  controllers: [ParkingLotController],
  exports: [ParkingLotService],
})
export class ParkingLotModule {}