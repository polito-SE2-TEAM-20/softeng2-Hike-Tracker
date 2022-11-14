import path, { join } from 'path';

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
import { isNil } from 'ramda';
import { DataSource } from 'typeorm';

import {
  GPX_FILE_PATH,
  Hike,
  HikePoint,
  ID,
  Point,
  User,
  UserRole,
} from '@app/common';
import { GpxService } from '@app/gpx';

import { PointsService } from '../points/points.service';

import { UpdateHikeDto } from './hikes.dto';
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
  async getFilteredHikes(@Body() body: any): Promise<Hike[]> {
    const query = this.dataSource
      .getRepository(Hike)
      .createQueryBuilder('hikes');

    if (!isNil(body.region)) {
      query.andWhere('hikes.region = :region', { region: body.region });
    }
    if (!isNil(body.province)) {
      query.andWhere('hikes.province = :province', { province: body.province });
    }
    if (!isNil(body.maxLength)) {
      query.andWhere('hikes.length <= :maxLength', {
        maxLength: body.maxLength,
      });
    }
    if (!isNil(body.minLength)) {
      query.andWhere('hikes.length >= :minLength', {
        minLength: body.minLength,
      });
    }
    if (!isNil(body.difficultyMax)) {
      query.andWhere('hikes.difficulty <= :maxDifficulty', {
        maxDifficulty: body.difficultyMax,
      });
    }
    if (!isNil(body.difficultyMin)) {
      query.andWhere('hikes.difficulty >= :difficultyMin', {
        difficultyMin: body.difficultyMin,
      });
    }
    if (!isNil(body.expectedTimeMax)) {
      query.andWhere('hikes.length <= :expectedTimeMax', {
        expectedTimeMax: body.expectedTimeMax,
      });
    }
    if (!isNil(body.expectedTimeMin)) {
      query.andWhere('hikes.expectedTime >= :expectedTimeMin', {
        expectedTimeMin: body.expectedTimeMin,
      });
    }
    if (!isNil(body.ascentMax)) {
      query.andWhere('hikes.ascent <= :ascentMax', {
        ascentMax: body.ascentMax,
      });
    }
    if (!isNil(body.ascentMin)) {
      query.andWhere('hikes.ascent >= :ascentMin', {
        ascentMin: body.ascentMin,
      });
    }

    const hikes = await query.getMany();
    console.log(hikes);
    return hikes;
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

  @Get(':id')
  async getHike(@Param('id') id: ID): Promise<Hike | null> {
    const hike = await this.service.findById(id);

    if (!hike) {
      return null;
    }

    return {
      ...hike,
      gpx: hike.gpxPath
        ? (
            await fs.readFile(join(GPX_FILE_PATH, path.basename(hike.gpxPath)))
          ).toString()
        : null,
    };
  }
}
