import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

import {
  AuthenticatedOnly,
  CurrentUser,
  Hut,
  ParkingLot,
  Point,
  UserContext,
} from '@app/common';
import { PointWithRadius } from '@core/huts/huts.dto';

@Controller('hike-modification')
export class HikeModificationController {
  constructor(private dataSource: DataSource) {}

  @Post('hutsAndParkingLots')
  @AuthenticatedOnly()
  @HttpCode(200)
  async filterHuts(
    @Body()
    { lat, lon, radiusKms = 10 }: PointWithRadius,
    @CurrentUser() { id: userId }: UserContext,
  ): Promise<{ huts: Hut[]; parkingLots: ParkingLot[] }> {
    const query1 = this.dataSource
      .getRepository(Hut)
      .createQueryBuilder('h')
      .andWhere('h.userId = :userId', { userId });
    const query2 = this.dataSource
      .getRepository(ParkingLot)
      .createQueryBuilder('pl')
      .andWhere('pl.userId = :userId', { userId });

    query1
      .andWhere(
        `ST_DWithin(ST_MakePoint(${lon}, ${lat}), p."position", ${radiusKms}*1000)`,
      )
      .leftJoinAndMapOne('h.point', Point, 'p', 'p.id = h."pointId"')
      .orderBy('h.id', 'DESC');

    query2
      .andWhere(
        `ST_DWithin(ST_MakePoint(${lon}, ${lat}), p."position", ${radiusKms}*1000)`,
      )
      .leftJoinAndMapOne('pl.point', Point, 'p', 'p.id = pl."pointId"')
      .orderBy('pl.id', 'DESC');

    return {
      huts: await query1.getMany(),
      parkingLots: await query2.getMany(),
    };
  }
}
