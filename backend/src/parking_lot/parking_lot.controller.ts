import { Body, Controller, HttpCode, Post, Get } from '@nestjs/common';
import { ParkingLotService } from './parking_lot.service';
import { LocalGuideOnly, ParkingLot, CurrentUser, UserContext } from '@app/common';
import { ParkingLotDto } from './parking_lot.dto';


@Controller('parkingLot')
export class ParkingLotController {

    constructor(private parkingLot: ParkingLotService){}

    @Get('lots')
    @LocalGuideOnly()
    async getLots(@CurrentUser() user: UserContext): Promise<ParkingLot[]> {
        return await this.parkingLot.retrieveParkingLots(user.id)
    }

    @Post('insertLot')
    @LocalGuideOnly()
    @HttpCode(201)
    async insertParkingLot(@Body() body: ParkingLotDto,@CurrentUser() user: UserContext): Promise<ParkingLot> {
        return await this.parkingLot.insertParkingLot(body, user.id) 
    }



}
