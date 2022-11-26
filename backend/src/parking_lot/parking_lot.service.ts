import { ParkingLot, BaseService, Point, GPoint, PointType } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ParkingLotDto } from './parking_lot.dto';


export class ParkingLotService extends BaseService<ParkingLot> {
  constructor(
    @InjectRepository(ParkingLot)
    private parkingLotRepository: Repository<ParkingLot>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {
    super(ParkingLot, {
      repository: parkingLotRepository,
      errorMessage: 'Parking Lot not found',
    });
  }

  async insertParkingLot(lot: ParkingLotDto, userId: number) {

    const position : GPoint = {
      type: 'Point',
      coordinates: [lot.location!!.lon, lot.location!!.lat],
    }

    const point = await this.pointRepository.save({
      type: PointType.parkingLot,
      position: position,
      address : lot.location?.address,
      name: lot.location?.name
    })

    const parkingLot = await this.parkingLotRepository.save(
        {
            userId: userId,
            pointId: point.id,
            ...lot
        }
    )
    
    return parkingLot;
  }

  async retrieveParkingLots(userId: number) {

    const lots = await this.parkingLotRepository
      .createQueryBuilder('l')
      .leftJoinAndMapOne('l.point', Point, 'p', 'p.id = l."pointId"')
      .where('l.userId = :userId', { userId })
      .getMany();

    return lots;
  }


}