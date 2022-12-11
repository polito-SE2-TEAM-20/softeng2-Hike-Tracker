import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { isNil, prop } from 'ramda';
import { DataSource } from 'typeorm';

import {
  CurrentUser,
  Hut,
  HutWorker,
  HutWorkerOnly,
  ID,
  LocalGuideAndHutWorkerOnly,
  LocalGuideOnly,
  Point,
  UserContext,
} from '@app/common';

import { CreateHutDto, FilterHutsDto } from './huts.dto';
import { HutsService } from './huts.service';

@Controller('huts')
export class HutsController {
  constructor(private service: HutsService, private dataSource: DataSource) {}

  @Get('mine')
  @LocalGuideOnly()
  async mine(@CurrentUser() user: UserContext): Promise<Hut[]> {
    const userId = user.id;
    const huts = await this.service
      .getRepository()
      .createQueryBuilder('h')
      .leftJoinAndMapOne('h.point', Point, 'p', 'p.id = h."pointId"')
      .where('h.userId = :userId', { userId })
      .getMany();

    return huts;
  }

  @Post('filter')
  @HttpCode(200)
  async filterHuts(
    @Body()
    {
      priceMin,
      priceMax,
      numberOfBedsMax,
      numberOfBedsMin,
      inPointRadius,
    }: FilterHutsDto,
  ): Promise<Hut[]> {
    const query = this.service.getRepository().createQueryBuilder('h');

    if (!isNil(inPointRadius)) {
      const radius = !isNil(inPointRadius.radiusKms)
        ? inPointRadius.radiusKms * 1000
        : 10 * 1000;

      query.andWhere(
        `ST_DWithin(ST_MakePoint(${inPointRadius.lon}, ${inPointRadius.lat}), p."position", ${radius})`,
      );
    }

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
      .innerJoinAndMapOne('h.point', Point, 'p', 'p.id = h."pointId"')
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
      throw new BadRequestException(`Hut ${id} not found`);
    }

    return hut;
  }

  @Post('createHut')
  @LocalGuideAndHutWorkerOnly()
  async createHut(
    @Body() body: CreateHutDto,
    @CurrentUser() user: UserContext,
  ): Promise<Hut> {
    return await this.service.createNewHut(body, user.id);
  }

  //Used to get all the huts where the hut worker user is working
  @Get('hutWorker/iWorkAt')
  @HutWorkerOnly()
  async getHutWorkerHuts(@CurrentUser() user: UserContext): Promise<Hut[]> {
    //Retrieve all the hutsIDs given the hut worker
    const myHuts = (
      await this.dataSource.getRepository(HutWorker).findBy({
        userId: user.id,
      })
    ).map(prop('hutId'));

    if (!myHuts.length) {
      return [];
    }

    //Retrieve all the Huts where an hut worker is the user
    return await this.service
      .getRepository()
      .createQueryBuilder('h')
      .leftJoinAndMapOne('h.point', Point, 'p', 'p.id = h."pointId"')
      .where('h.id IN (:...myHuts)', { myHuts })
      .getMany();
  }

  //Used to update the specified hut description and time table
  @Put('updateDescription/:id')
  @HutWorkerOnly()
  async updateHutDescription(
    @Param('id', new ParseIntPipe()) id: ID,
    @CurrentUser() user: UserContext,
    @Body() { description, workingTimeStart, workingTimeEnd, price },
  ): Promise<Hut> {
    if (
      (!isNil(workingTimeStart) && isNil(workingTimeEnd)) ||
      (!isNil(workingTimeEnd) && isNil(workingTimeStart))
    )
      throw new BadRequestException(
        'You must specify both starting/ending working time or none of them',
      );

    //Retrieve all the hutsIDs given the hut worker
    const myHuts = (
      await this.dataSource.getRepository(HutWorker).findBy({
        userId: user.id,
      })
    ).map((hutWorker) => hutWorker.hutId);

    //If the user is not working to that hut will throw an exception
    if (!myHuts.includes(id))
      throw new BadRequestException(
        'You are not authorized to modify this hut description.',
      );

    //Update the chosen hut with various fields
    return await this.dataSource.getRepository(Hut).save({
      id,
      description: description || '',
      workingTimeStart: workingTimeStart || '',
      workingTimeEnd: workingTimeEnd || '',
      price: price || null,
    });
  }
}
