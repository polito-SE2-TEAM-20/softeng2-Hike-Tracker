import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ParkingLotService } from './parking_lot.service';
import { LocalGuideOnly } from '@app/common';


@Controller('parkingLot')
export class ParkingLotController {

    constructor(private parkingLot: ParkingLotService){}

    @Post('insertLot')
    @LocalGuideOnly()
    @HttpCode(200)
    async insertParkingLot(@Body() body: any) {
        return {
            LotInserted: await this.parkingLot.insertParkingLot(body)
        }
    }



}
