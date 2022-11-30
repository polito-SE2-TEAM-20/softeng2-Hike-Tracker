import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { isNil } from 'ramda';

import {
  CurrentUser,
  Hut,
  ID,
  IMAGES_URI,
  LocalGuideAndHutWorkerOnly,
  Point,
  UserContext,
} from '@app/common';

import { CreateHutDto, FilterHutsDto } from './huts.dto';
import { HutsService } from './huts.service';

@Controller('huts')
export class HutsController {
  constructor(private service: HutsService) {}

  @Get('mine')
  @LocalGuideAndHutWorkerOnly()
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
      throw new Error(`Hut ${id} not found`);
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

  @Put(':id')
  @UseInterceptors(FilesInterceptor('pictures', 20))
  @LocalGuideAndHutWorkerOnly()
  async updateHutPhotos(
    @Param('id', ParseIntPipe) id: ID,
    @CurrentUser() user: UserContext,
    @UploadedFiles()
    files: Express.Multer.File[],
  ): Promise<Hut> {
    await this.service.findByIdOrThrow(id);

    const pictures = files.map(({ filename }) =>
      [IMAGES_URI, filename].join('/'),
    );

    return await this.service.getRepository().save({ id, pictures });
  }
}
