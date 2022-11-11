import {
  Controller,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { DataSource } from 'typeorm';

import { Hike, HikePoint, Point, User, UserRole } from '@app/common';
import { GpxService } from '@app/gpx';

import { PointsService } from '../points/points.service';

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

    if (body.region !== null)
      query.where('hikes.region = :region', { region: body.region });
    if (body.province !== null)
      query.andWhere('hikes.province = :province', { province: body.province });
    if (body.maxLength !== null)
      query.andWhere('hikes.length <= :maxLength', {
        maxLength: body.maxLength,
      });
    if (body.minLength !== null)
      query.andWhere('hikes.length >= :minLength', {
        minLength: body.minLength,
      });
    if (body.difficultyMax !== null)
      query.andWhere('hikes.difficulty <= :maxDifficulty', {
        maxDifficulty: body.difficultyMax,
      });
    if (body.difficultyMin !== null)
      query.andWhere('hikes.difficulty >= :difficultyMin', {
        difficultyMin: body.difficultyMin,
      });
    if (body.expectedTimeMax !== null)
      query.andWhere('hikes.length <= :expectedTimeMax', {
        expectedTimeMax: body.expectedTimeMax,
      });
    if (body.expectedTimeMin !== null)
      query.andWhere('hikes.expectedTime >= :expectedTimeMin', {
        expectedTimeMin: body.expectedTimeMin,
      });
    if (body.ascentMax !== null)
      query.andWhere('hikes.ascent <= :ascentMax', {
        ascentMax: body.ascentMax,
      });
    if (body.ascentMin !== null)
      query.andWhere('hikes.ascent >= :ascentMin', {
        ascentMin: body.ascentMin,
      });

    const hikes = await query.getMany();
    console.log(hikes);
    return hikes;
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('gpxFile'))
  @HttpCode(200)
  async import(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'gpx' })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ): Promise<{ hikes: Hike[] }> {
    const gpx = await fs.readFile(file.path);
    const gpxText = gpx.toString('utf8');
    const parsedHikes = await this.gpxService.parseHikes(gpxText);

    // upsert all parsed hikes to db
    const hikes: Hike[] = [];

    // todo: get real user
    const user = await this.dataSource.getRepository(User).save({
      firstName: '',
      lastName: '',
      password: '',
      role: UserRole.localGuide,
    });

    for (const hikeData of parsedHikes) {
      const { hike } = await this.dataSource.transaction<{
        hike: Hike;
        points: Point[];
      }>(async (entityManager) => {
        const hike = await this.service.getRepository(entityManager).save({
          ...hikeData.hike,
          userId: user.id,
        });

        const points = await this.pointsService
          .getRepository(entityManager)
          .save(hikeData.points);

        await entityManager.getRepository(HikePoint).save(
          points.map<HikePoint>((point, index) => ({
            hikeId: hike.id,
            pointId: point.id,
            index,
          })),
        );

        return { hike, points };
      });

      hikes.push(hike);
    }

    return { hikes };
  }
}
