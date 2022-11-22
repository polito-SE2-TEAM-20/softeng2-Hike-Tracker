import { Body, Controller, HttpCode, Post, HttpException } from '@nestjs/common';
import { ParkingLotService } from './parking_lot.service';
import { LocalGuideOnly, ParkingLot } from '@app/common';
import { ParkingLotDto } from './parking_lot.dto';


@Controller('parkingLot')
export class ParkingLotController {

    constructor(private parkingLot: ParkingLotService){}

    @Post('insertLot')
    @LocalGuideOnly()
    @HttpCode(201)
    async insertParkingLot(@Body() body: ParkingLotDto): Promise<ParkingLot> {
        try {
            return await this.parkingLot.insertParkingLot(body) 
        }
        catch {
            throw new HttpException('There is no point with this id', 422);
        }       
    }



}
