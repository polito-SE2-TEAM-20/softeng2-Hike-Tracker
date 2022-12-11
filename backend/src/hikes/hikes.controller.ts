import {
  Controller,
  Get,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Put,
  Param,
  ParseFilePipeBuilder,
  HttpStatus,
  HttpCode,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { isEmpty, isNil, keys, propEq } from 'ramda';
import { DataSource, In } from 'typeorm';

import {
  CurrentUser,
  GPoint,
  GPX_FILE_URI,
  GroupValidationPipe,
  Hike,
  HikeFull,
  HikePoint,
  Hut,
  HutWorker,
  HutWorkerOnly,
  ID,
  latLonToGisPoint,
  LocalGuideOnly,
  ParkingLot,
  ParseIdPipe,
  Point,
  PointType,
  UserContext,
} from '@app/common';
import { HikeCondition } from '@app/common/enums/hike-condition.enum';
import { GpxService } from '@app/gpx';

import { PointsService } from '../points/points.service';

import {
  FilteredHikesDto,
  HikeDto,
  LinkHutToHikeDto,
  UpdateHikeDto,
} from './hikes.dto';
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
  @HttpCode(HttpStatus.OK)
  async getFilteredHikes(
    @Body()
    { inPointRadius, ...body }: FilteredHikesDto,
  ): Promise<Hike[]> {

    return await this.service.getFilteredHikes({inPointRadius, ...body})
  }

  @Post('import')
  @LocalGuideOnly()
  @UseInterceptors(FileInterceptor('gpxFile'))
  async import(
    @UploadedFile(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
    @Body()
    {
      referencePoints: referencePointsArray,
      startPoint: _startPoint,
      endPoint: _endPoint,
      ...body
    }: HikeDto,
    @CurrentUser() user: UserContext,
  ): Promise<HikeFull | null> {
    const gpx = await fs.readFile(file.path);
    const gpxText = gpx.toString('utf8');
    const [parsedHike] = await this.gpxService.parseHikes(gpxText);

    if (!parsedHike) {
      throw new BadRequestException('Unable to find hikes in gpx file');
    }

    // insert hike into database
    const { hike } = await this.dataSource.transaction<{
      hike: Hike;
      points: Point[];
    }>(async (entityManager) => {
      const hikePointsRepo = entityManager.getRepository(HikePoint);
      const pointsRepo = entityManager.getRepository(Point);

      const hike = await this.service.getRepository(entityManager).save({
        userId: user.id,
        gpxPath: [GPX_FILE_URI, file.filename].join('/'),
        ...parsedHike.hike,
        ...body,
      });

      //Antonio's code for refPoint insertion starts here

      const refPointsForDB = referencePointsArray.map((refPoint) => {
        return {
          name: refPoint.name,
          address: refPoint.address,
          point: latLonToGisPoint(refPoint),
        };
      });

      const referencePoints = await pointsRepo.save(
        refPointsForDB.map<Partial<Point>>((point) => ({
          type: 0,
          position: point.point,
          address: point.address,
          name: point.name,
        })),
      );

      await hikePointsRepo.save(
        referencePoints.map<HikePoint>((point, index) => ({
          hikeId: hike.id,
          pointId: point.id,
          index,
          type: PointType.referencePoint,
        })),
      );
      //Antonio's code ends here

      // insert start/end points
      await this.service.upsertStartEndPoints(
        {
          id: hike.id,
          startPoint: _startPoint,
          endPoint: _endPoint,
        },
        entityManager,
      );

      return { hike, points: referencePoints };
    });

    return await this.service.getFullHike(hike.id);
  }

  @Post('linkPoints')
  @LocalGuideOnly()
  @HttpCode(HttpStatus.OK)
  async linkPoints(
    @Body(new GroupValidationPipe()) { hikeId, linkedPoints }: LinkHutToHikeDto,
  ): Promise<HikeFull> {
    await this.service.ensureExistsOrThrow(hikeId);

    // get points of these entities
    const hutIds = linkedPoints.filter((v) => !!v.hutId).map((v) => v.hutId);
    const parkingLotIds = linkedPoints
      .filter((v) => !!v.parkingLotId)
      .map((v) => v.parkingLotId);

    const points: Point[] = [];

    if (hutIds.length) {
      const hutPoints = await this.dataSource
        .getRepository(Point)
        .createQueryBuilder('p')
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select(['h.pointId'])
            .from(Hut, 'h')
            .andWhere('h.id IN (:...hutIds)', {
              hutIds,
            })
            .getQuery();

          return `p.id IN ${subQuery}`;
        })
        .getMany();

      points.push(...hutPoints);
    }

    if (parkingLotIds.length) {
      const parkingLotPoints = await this.dataSource
        .getRepository(Point)
        .createQueryBuilder('p')
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select(['pl.pointId'])
            .from(ParkingLot, 'pl')
            .andWhere('pl.id IN (:...parkingLotIds)', {
              parkingLotIds,
            })
            .getQuery();

          return `p.id IN ${subQuery}`;
        })
        .getMany();

      points.push(...parkingLotPoints);
    }

    console.log('linked points', points);

    await this.dataSource.transaction(async (entityManager) => {
      // remove all existing links
      await entityManager.getRepository(HikePoint).delete({
        hikeId,
        type: PointType.linkedPoint,
      });

      // save new links
      if (points.length) {
        await entityManager.getRepository(HikePoint).save(
          points.map<Partial<HikePoint>>(({ id: pointId }, index) => ({
            index,
            hikeId,
            pointId,
            type: PointType.linkedPoint,
          })),
        );
      }
    });

    console.log('after tx');
    return await this.service.getFullHike(hikeId);
  }

  @Put(':id')
  @LocalGuideOnly()
  async updateHike(
    @Param('id', ParseIdPipe()) id: ID,
    @Body()
    {
      referencePoints: hikeReferencePoints,
      startPoint,
      endPoint,
      ...data
    }: UpdateHikeDto,
  ): Promise<Hike> {
    await this.service.ensureExistsOrThrow(id);

    //Antonio's code on Ref Points Update starts here
    /*
        OPERATIONS TO DO:
        - SELECT all Ref Points Id in HikePoint table; ✓
        - DELETE all Ref Points associated to a certain hike in Point table by IDs previously selected; ✓
        - INSERT new Ref Points in Points; ✓
        - INSERT new Ref Points in HikePoints; ✓
      */
    if (!isNil(hikeReferencePoints)) {
      const points = await this.dataSource.getRepository(HikePoint).findBy({
        hikeId: id,
        type: PointType.referencePoint,
      });

      const pointsToDelete = points.map((hikePoint) => hikePoint.pointId);

      await this.pointsService.getRepository().delete({
        id: In(pointsToDelete),
      });

      //Creation of proper ref points
      const refPointsForDB = hikeReferencePoints.map((refPoint) => {
        const pointObject: GPoint = {
          type: 'Point',
          coordinates: [refPoint.lon, refPoint.lat],
        };

        const refPointForDB = {
          name: refPoint.name,
          address: refPoint.address,
          point: pointObject,
        };
        return refPointForDB;
      });

      //INSERT into Points table of the RefPoints
      const referencePoints = await this.pointsService.getRepository().save(
        refPointsForDB.map<Partial<Point>>((point) => ({
          type: PointType.point,
          position: point.point,
          address: point.address,
          name: point.name,
        })),
      );

      //INSERT into HikePoints table of the RefPoints
      await this.dataSource.getRepository(HikePoint).save(
        referencePoints.map<HikePoint>((point, index) => ({
          hikeId: id,
          pointId: point.id,
          index,
          type: PointType.referencePoint,
        })),
      );
    }
    //Antonio's code ends here

    // update start and end point
    await this.service.upsertStartEndPoints({ id, startPoint, endPoint });

    if (!isEmpty(keys(data))) {
      await this.service.getRepository().update({ id }, data);
    }

    return await this.service.getFullHike(id);
  }

  @Put('condition/:id')
  @HutWorkerOnly()
  async updateHikeCondition(
    @Param('id', ParseIdPipe()) id: ID,
    @CurrentUser() user: UserContext,
    @Body()
    { condition, cause },
  ): Promise<Hike> {
    //If the condition to be updated is not 'Open' a cause/description MUST be provided
    if (condition !== HikeCondition.open && isNil(cause)) {
      throw new BadRequestException(
        'If the condition is not open you MUST provide a cause or a description of the problem.',
      );
    }

    //Need all huts IDs to look up and see if a point in the trail is a hut
    const allHutIDs = (await this.dataSource.getRepository(Hut).find()).map(
      (hut) => hut.pointId,
    );

    //Check to see if there are huts on the chosen hike
    const checkIfThereAreHuts = await this.dataSource
      .getRepository(HikePoint)
      .findBy({
        hikeId: id,
        pointId: In(allHutIDs),
        type: In([
          PointType.linkedPoint,
          PointType.startPoint,
          PointType.endPoint,
        ]),
      });

    //If there are no huts the hut worker is not authorized to change hike condition
    if (checkIfThereAreHuts.length === 0) {
      throw new BadRequestException(
        'You are not authorized to change this condition since there are not Huts of your property.',
      );
    }

    //retrieve hut's pointIDs by the hikepoints of the chosen hike
    const hutsId = (
      await this.dataSource.getRepository(Hut).findBy({
        pointId: In(checkIfThereAreHuts.map((hp) => hp.pointId)),
      })
    ).map((hut) => hut.id);

    //check if the hut worker works in one of the huts on the hike trail
    const checkHutsProperty = await this.dataSource
      .getRepository(HutWorker)
      .findBy({
        hutId: In(hutsId),
        userId: user.id,
      });

    //If the hut work does not work in one of the huts return error
    if (checkHutsProperty.length === 0) {
      throw new BadRequestException(
        'You are not authorized to change this condition since there are not Huts in which you work on this trail.',
      );
    }

    //If an exception has not been thrown before, update the condition and the cause
    return await this.service.getRepository().save({
      id,
      condition,
      cause: cause || '',
    });
  }

  //Used to gett all the hikes that current hut worker (user)
  //can update conditions
  @Get('hutWorkerHikes')
  @HutWorkerOnly()
  async getHutWorkerHikes(@CurrentUser() user: UserContext): Promise<Hike[]> {
    //Retrieve all the hutsIDs given the hut worker
    const myHuts = (
      await this.dataSource.getRepository(HutWorker).findBy({
        userId: user.id,
      })
    ).map((hutWorker) => hutWorker.hutId);

    //Retrieve all the pointIDs related to previous Huts
    const myHutPoints = (
      await this.dataSource.getRepository(Hut).findBy({
        id: In(myHuts),
      })
    ).map((hut) => hut.pointId);

    //Retrieve all the hikeIDs which are related to the huts got before
    const validHikes = (
      await this.dataSource.getRepository(HikePoint).findBy({
        pointId: In(myHutPoints),
      })
    ).map((hikePoint) => hikePoint.hikeId);

    //Return all the hikes which have a hut on their trail whose the hut worker is the user
    return await this.service.getRepository().findBy({
      id: In(validHikes),
    });
  }

  @Delete(':id')
  @LocalGuideOnly()
  @HttpCode(200)
  async deleteHike(
    @Param('id', ParseIdPipe()) id: ID,
    @CurrentUser() user: UserContext,
  ): Promise<{ rowsAffected: number }> {
    const hikeOwner = (
      await this.service.getRepository().findOneBy({
        id,
      })
    )?.userId;

    if (hikeOwner !== user.id) {
      throw new BadRequestException(
        'This local guide can not delete this hike.',
      );
    }

    // const pointsToDelete = await this.dataSource
    //   .getRepository(HikePoint)
    //   .findBy({
    //     hikeId: id,
    //   });

    const deletion = await this.service.getRepository().delete({
      id,
    });

    // if (deletion.affected === 0 || isNil(deletion.affected)) {
    //   throw new BadRequestException('Hike not found.');
    // }

    // const pointsID = pointsToDelete.map((point) => point.pointId);

    // await this.pointsService.getRepository().delete({
    //   id: In(pointsID),
    // });

    return { rowsAffected: isNil(deletion.affected) ? 0 : deletion.affected };
  }

  @Get(':id')
  async getHike(@Param('id', ParseIdPipe()) id: ID): Promise<HikeFull> {
    return await this.service.getFullHike(id);
  }
}
