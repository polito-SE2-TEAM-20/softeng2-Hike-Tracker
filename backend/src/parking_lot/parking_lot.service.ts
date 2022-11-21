import { ParkingLot,BaseService } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ParkingLotDto } from './parking_lot.dto';


export class ParkingLotService extends BaseService<ParkingLot> {
  constructor(
    @InjectRepository(ParkingLot)
    private parkingLotRepository: Repository<ParkingLot>,
  ) {
    super(ParkingLot, {
      repository: parkingLotRepository,
      errorMessage: 'Parking Lot not found',
    });
  }

  async insertParkingLot(lot: ParkingLotDto, entityManager?: EntityManager) {
    const parkingLot = await this.getRepository(entityManager).save(
        {
            pointId: lot.pointId,
            maxCars: lot.maxCars
        }
    )
    
    return parkingLot;
  }


}