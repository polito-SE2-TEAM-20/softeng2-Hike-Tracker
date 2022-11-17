import { join } from 'path';

import {
  Controller,
  Get,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Put,
  Param,
  DefaultValuePipe,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { propEq } from 'ramda';
import { DataSource, In } from 'typeorm';

import {
  GPX_FILE_PATH,
  Hike,
  HikePoint,
  ID,
  mapToId,
  orderEntities,
  Point,
  User,
  UserRole,
} from '@app/common';
import { GpxService } from '@app/gpx';

import { PointsService } from '../points/points.service';

import { hikeFilters } from './hikes.constants';
import { FilteredHikesDto, UpdateHikeDto } from './hikes.dto';
import { HikesService } from './hikes.service';

@Controller('hikes')
export class HikesController {
  constructor(
    private dataSource: DataSource,
    private gpxService: GpxService,
    private service: HikesService,
    private pointsService: PointsService,
  ) {}

  @Get()
  async getHikes(): Promise<Hike[]> {
    return await this.dataSource.getRepository(Hike).findBy({});
  }

  @Post('/filteredHikes')
  async getFilteredHikes(
    @Body()
    { inPointRadius, ...body }: FilteredHikesDto,
  ): Promise<Hike[]> {
    let joins = '';
    const whereConditions: string[] = [];
    let paramIndex = 1;
    const params: unknown[] = [];

    if (inPointRadius) {
      whereConditions.push(
        `ST_DWithin(ST_MakePoint($${paramIndex++}, $${paramIndex++}), p."position", $${paramIndex++})`,
      );
      params.push(
        inPointRadius.lon,
        inPointRadius.lat,
        inPointRadius.radiusKms * 1000,
      );

      joins += `
        inner join (
          select spq.*
          from (
              select
                hp."pointId",
                hp."hikeId",
                ROW_NUMBER() OVER(PARTITION BY hp."hikeId" ORDER BY hp."index" ASC) AS rank
              from hike_points hp
          ) spq
          where spq.rank = 1
        ) sq on sq."hikeId" = h.id
        inner join points p on p.id = sq."pointId"
      `;
    }

    // apply dynamic filters
    Object.keys(body).forEach((filterKey) => {
      const maybeFilter = hikeFilters[filterKey as keyof FilteredHikesDto];

      if (maybeFilter) {
        whereConditions.push(
          `hikes."${maybeFilter.entityField}" ${
            maybeFilter.operator
          } $${paramIndex++}`,
        );
        params.push(body[filterKey]);
      }
    });

    const queryRaw = `
      select h.*
      from hikes h
      ${joins}
      where ${whereConditions.length ? whereConditions.join(',') : 'true'}
      order by h.id asc
    `;

    const rawHikes = await this.service.getRepository().query(queryRaw, params);
    const hikeIds = mapToId(rawHikes);
    const hikes = await this.service
      .getRepository()
      .findBy({ id: In(hikeIds) });
    const orderedHikes = orderEntities(hikes, hikeIds, propEq('id'));

    return orderedHikes;
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('gpxFile'))
  async import(
    @UploadedFile(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
    @Body('title', new DefaultValuePipe('')) title: string,
    @Body('description', new DefaultValuePipe('')) description: string,
  ): Promise<Hike | null> {
    const gpx = await fs.readFile(file.path);
    const gpxText = gpx.toString('utf8');
    const [parsedHike] = await this.gpxService.parseHikes(gpxText);

    if (!parsedHike) {
      return null;
    }

    // todo: get real user
    const user =
      (await this.dataSource
        .getRepository(User)
        .findOneBy({ email: 'test@test.com' })) ??
      (await this.dataSource.getRepository(User).save({
        firstName: '',
        lastName: '',
        password: '',
        email: 'test@test.com',
        role: UserRole.localGuide,
      }));

    // insert hike into database
    const { hike } = await this.dataSource.transaction<{
      hike: Hike;
      points: Point[];
    }>(async (entityManager) => {
      const hike = await this.service.getRepository(entityManager).save({
        ...parsedHike.hike,
        title,
        description,
        userId: user.id,
        gpxPath: join(GPX_FILE_PATH, file.filename),
      });

      const points = await this.pointsService
        .getRepository(entityManager)
        .save(parsedHike.points);

      await entityManager.getRepository(HikePoint).save(
        points.map<HikePoint>((point, index) => ({
          hikeId: hike.id,
          pointId: point.id,
          index,
        })),
      );

      return { hike, points };
    });

    return hike;
  }

  @Put(':id')
  async updateHike(
    @Param('id') id: ID,
    @Body() data: UpdateHikeDto,
  ): Promise<Hike> {
    await this.service.ensureExistsOrThrow(id);

    await this.service.getRepository().update({ id }, data);

    return await this.service.findByIdOrThrow(id);
  }

  
  // @Get(':id')
  // async getHike(@Param('id') id: ID): Promise<Hike | null> {
  //   const hike = await this.service.findById(id);

  //   if (!hike) {
  //     return null;
  //   }

  //   return {
  //     ...hike,
  //     gpx: hike.gpxPath
  //       ? (
  //           await fs.readFile(join(GPX_FILE_PATH, path.basename(hike.gpxPath)))
  //         ).toString()
  //       : null,
  //   };
  // }
}
