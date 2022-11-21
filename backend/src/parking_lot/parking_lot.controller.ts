import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ParkingLotService } from './parking_lot.service';
import { LocalGuideOnly, ParkingLot } from '@app/common';
import { ParkingLotDto } from './parking_lot.dto';


@Controller('parkingLot')
export class ParkingLotController {

    constructor(private parkingLot: ParkingLotService){}

    @Post('insertLot')
    //@LocalGuideOnly()
    @HttpCode(201)
    async insertParkingLot(@Body() body: ParkingLotDto): Promise<ParkingLot> {
        return await this.parkingLot.insertParkingLot(body)   
    }



}
