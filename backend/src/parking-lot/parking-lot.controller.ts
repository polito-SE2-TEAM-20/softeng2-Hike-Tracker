import { Body, Controller, HttpCode, Post, Get } from '@nestjs/common';

import {
  LocalGuideOnly,
  ParkingLot,
  CurrentUser,
  UserContext,
  AuthenticatedOnly,
} from '@app/common';

import { ParkingLotDto } from './parking-lot.dto';
import { ParkingLotService } from './parking-lot.service';

@Controller('parkingLot')
export class ParkingLotController {
  constructor(private parkingLot: ParkingLotService) {}

  @Get('lots')
  @LocalGuideOnly()
  @HttpCode(200)
  async getLots(@CurrentUser() user: UserContext): Promise<ParkingLot[]> {
    return await this.parkingLot.retrieveParkingLots(user.id);
  }

  @Get('all_lots')
  @AuthenticatedOnly()
  @HttpCode(200)
  async getAllLots(): Promise<ParkingLot[]> {
    return await this.parkingLot.retrieveAllParkingLots();
  }

  @Post('insertLot')
  @LocalGuideOnly()
  @HttpCode(201)
  async insertParkingLot(
    @Body() body: ParkingLotDto,
    @CurrentUser() user: UserContext,
  ): Promise<ParkingLot> {
    return await this.parkingLot.insertParkingLot(body, user.id);
  }
}
