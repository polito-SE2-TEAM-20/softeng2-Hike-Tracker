import { Body, Controller, HttpCode, Post, HttpException } from '@nestjs/common';
import { ParkingLotService } from './parking_lot.service';
import { LocalGuideOnly, ParkingLot, CurrentUser, UserContext } from '@app/common';
import { ParkingLotDto } from './parking_lot.dto';


@Controller('parkingLot')
export class ParkingLotController {

    constructor(private parkingLot: ParkingLotService){}

    @Post('insertLot')
    @LocalGuideOnly()
    @HttpCode(201)
    async insertParkingLot(@Body() body: ParkingLotDto,@CurrentUser() user: UserContext): Promise<ParkingLot> {
        return await this.parkingLot.insertParkingLot(body, user.id) 
    }



}
