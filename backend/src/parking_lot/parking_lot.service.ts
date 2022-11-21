import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ParkingLot } from '@app/common';

@Injectable()
export class ParkingLotService {

    constructor(
        private dataSource :DataSource
    ){};

    async insertParkingLot(lot: ParkingLot) {
        const parkingLot = this.dataSource.getRepository(ParkingLot).createQueryBuilder()
        .insert()
        .into(ParkingLot)
        .values(
            [{
                pointId: lot.pointId,
                maxCars: lot.maxCars
            }]   
        )
        .execute();

        return parkingLot;
    }


}