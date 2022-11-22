import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { isNil } from 'ramda';

import { Hut, ID, Point } from '@app/common';

import { FilterHutsDto } from './huts.dto';
import { HutsService } from './huts.service';

@Controller('huts')
export class HutsController {
  constructor(private service: HutsService) {}

  @Post('filter')
  @HttpCode(200)
  async filterHuts(
    @Body()
    { priceMin, priceMax, numberOfBedsMax, numberOfBedsMin }: FilterHutsDto,
  ): Promise<Hut[]> {
    const query = this.service.getRepository().createQueryBuilder('h');

    if (!isNil(priceMin)) {
      query.andWhere('h.price >= :priceMin', { priceMin });
    }
    if (!isNil(priceMax)) {
      query.andWhere('h.price <= :priceMax', { priceMax });
    }

    if (!isNil(numberOfBedsMin)) {
      query.andWhere('h.numberOfBeds >= :numberOfBedsMin', { numberOfBedsMin });
    }
    if (!isNil(numberOfBedsMax)) {
      query.andWhere('h.numberOfBeds <= :numberOfBedsMax', { numberOfBedsMax });
    }

    query
      .leftJoinAndMapOne('h.point', Point, 'p', 'p.id = h."pointId"')
      .orderBy('h.id', 'DESC');

    return await query.getMany();
  }

  @Get(':id')
  async getHut(@Param('id', new ParseIntPipe()) id: ID): Promise<Hut> {
    const hut = await this.service
      .getRepository()
      .createQueryBuilder('h')
      .leftJoinAndMapOne('h.point', Point, 'p', 'p.id = h."pointId"')
      .where('h.id = :id', { id })
      .getOne();

    if (!hut) {
      throw new Error(`Hut ${id} not found`);
    }

    return hut;
  }
}
