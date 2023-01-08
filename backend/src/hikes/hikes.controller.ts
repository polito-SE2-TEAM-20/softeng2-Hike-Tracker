import {
  Controller,
  Get,
  Body,
  Post,
  UseInterceptors,
  Put,
  Param,
  HttpStatus,
  HttpCode,
  Delete,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { isEmpty, isNil, keys } from 'ramda';
import { DataSource, In, IsNull, Not } from 'typeorm';

import {
  CurrentUser,
  GPoint,
  GPX_FILE_URI,
  GroupValidationPipe,
  Hike,
  HikeFull,
  HikeLimits,
  HikePoint,
  HikerOnly,
  Hut,
  HutWorker,
  HutWorkerOnly,
  ID,
  latLonToGisPoint,
  LocalGuideOnly,
  ParkingLot,
  ParseIdPipe,
  PlatformManagerOnly,
  Point,
  PointType,
  UserContext,
  UserHike,
} from '@app/common';
import { HikeCondition } from '@app/common/enums/hike-condition.enum';
import { GpxService } from '@app/gpx';
import { PicturesService } from '@core/pictures/pictures.service';

import { PointsService } from '../points/points.service';

import {
  FilteredHikesDto,
  HikeDto,
  LinkHutToHikeDto,
  UpdateHikeDto,
  WeatherFlagsDto,
  WeatherInRangeDto,
} from './hikes.dto';
import { HikesService } from './hikes.service';

@Controller('hikes')
export class HikesController {
  constructor(
    private dataSource: DataSource,
    private gpxService: GpxService,
    private service: HikesService,
    private picturesService: PicturesService,
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
    return await this.service.getFilteredHikes({ inPointRadius, ...body });
  }

  @Post('import')
  @LocalGuideOnly()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pictures', maxCount: HikeLimits.maxPictures },
      { name: 'gpxFile', maxCount: 1 },
    ]),
  )
  async import(
    @UploadedFiles()
    files: Record<'gpxFile' | 'pictures', Express.Multer.File[]>,
    @Body()
    {
      referencePoints: referencePointsArray,
      startPoint: _startPoint,
      endPoint: _endPoint,
      ...body
    }: HikeDto,
    @CurrentUser() user: UserContext,
  ): Promise<HikeFull | null> {
    console.log('files are', files);
    const gpxFile = files.gpxFile[0];
    const gpx = await fs.readFile(gpxFile.path);
    const gpxText = gpx.toString('utf8');
    const [parsedHike] = await this.gpxService.parseHikes(gpxText);

    if (!parsedHike) {
      throw new BadRequestException('Unable to find hikes in gpx file');
    }

    // prepare images
    const pictures = files.pictures?.length
      ? this.picturesService.prepareFilePaths(files.pictures)
      : [];

    // insert hike into database
    const { hike } = await this.dataSource.transaction<{
      hike: Hike;
      points: Point[];
    }>(async (entityManager) => {
      const hikePointsRepo = entityManager.getRepository(HikePoint);
      const pointsRepo = entityManager.getRepository(Point);

      const hike = await this.service.getRepository(entityManager).save({
        userId: user.id,
        gpxPath: [GPX_FILE_URI, gpxFile.filename].join('/'),
        pictures,
        ...parsedHike.hike,
        ...body,
      });

      //Antonio's code for refPoint insertion starts here

      const refPointsForDB = referencePointsArray.map((refPoint) => {
        return {
          name: refPoint.name,
          address: refPoint.address,
          point: latLonToGisPoint(refPoint),
          altitude: refPoint.altitude,
        };
      });

      const referencePoints = await pointsRepo.save(
        refPointsForDB.map<Partial<Point>>((point) => ({
          type: 0,
          position: point.point,
          address: point.address,
          name: point.name,
          altitude: point.altitude,
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

    // console.log('linked points', points);

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
    const hike = await this.service.findByIdOrThrow(id);

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
      const refPointsForDB = hikeReferencePoints.map<
        Partial<Pick<Point, 'name' | 'address' | 'altitude'>> & {
          point: GPoint;
        }
      >((refPoint) => {
        const pointObject: GPoint = {
          type: 'Point',
          coordinates: [refPoint.lon, refPoint.lat],
        };

        const refPointForDB = {
          name: refPoint.name,
          address: refPoint.address,
          point: pointObject,
          altitude: refPoint.altitude,
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
          altitude: point.altitude,
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

    // update direct hike fields
    const updateData: Partial<Hike> = { ...data };

    if (data.pictures) {
      updateData.pictures =
        await this.picturesService.getPicturesListAndDeleteRemoved(
          data.pictures,
          hike.pictures,
        );
    }

    if (!isEmpty(keys(updateData))) {
      await this.service.getRepository().update({ id }, updateData);
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

  //Update an existing hike at weather fields (if no hike found or user !== platformManager -> exception)
  @Put('updateWeather/:id')
  @PlatformManagerOnly()
  @HttpCode(200)
  async updateHikeWeather(
    @Param('id', ParseIdPipe()) id: ID,
    @Body()
    { weatherStatus, weatherDescription },
  ): Promise<Hike> {
    await this.service.ensureExistsOrThrow(id);

    await this.service.getRepository().save({
      id,
      weatherStatus,
      weatherDescription,
    });

    const update = await this.dataSource.getRepository(UserHike).findBy({
      hikeId: id,
      finishedAt: IsNull(),
    });

    if (!isNil(update)) {
      await this.dataSource.getRepository(UserHike).update(
        {
          hikeId: In(update.map((userHike) => userHike.hikeId)),
        },
        {
          weatherNotified: false,
        },
      );
    }

    return await this.service.getFullHike(id);
  }

  //Function to update all the hikes at weather fields within a range -- all the notifications are sent, not only those of danger type
  @Put('range/updateWeatherInRange')
  @PlatformManagerOnly()
  @HttpCode(200)
  async updateHikeWeatherInRange(
    @Body()
    { inPointRadius, weatherStatus, weatherDescription }: WeatherInRangeDto,
  ): Promise<Hike[]> {
    const query = this.dataSource
      .getRepository(HikePoint)
      .createQueryBuilder('h');

    query.andWhere(
      `ST_DWithin(ST_MakePoint(${inPointRadius.lon}, ${
        inPointRadius.lat
      }), p."position", ${inPointRadius.radiusKms * 1000})`,
    );

    query
      .innerJoinAndMapOne('h.point', Point, 'p', 'p.id = h."pointId"')
      .orderBy('h.hikeId', 'DESC');

    const hikesToUpdate = await query.getMany();
    const hikesToUpdateIds = hikesToUpdate.map((hike) => hike.hikeId);

    await this.service.getRepository().save(
      hikesToUpdateIds.map((id) => ({
        id,
        weatherStatus,
        weatherDescription,
      })),
    );

    await this.dataSource.getRepository(UserHike).update(
      {
        hikeId: In(hikesToUpdateIds),
        finishedAt: IsNull(),
      },
      {
        weatherNotified: false,
      },
    );

    return await this.service.getRepository().findBy({
      id: In(hikesToUpdateIds),
    });
  }

  //Function which set the notification status to true after that the user sees the popup
  @Get('popupSeen/:id')
  @HikerOnly()
  @HttpCode(200)
  async popupSeen(
    @Param('id', ParseIdPipe()) id: ID,
    @CurrentUser() user: UserContext,
  ) {
    const update = await this.dataSource.getRepository(UserHike).findOneBy({
      hikeId: id,
      userId: user.id,
      finishedAt: IsNull(),
      weatherNotified: false,
    });

    if (!isNil(update)) {
      await this.dataSource.getRepository(UserHike).save({
        id: update.id,
        weatherNotified: true,
      });
    } else {
      throw new BadRequestException(
        "You can't close a popup because there is not one related to: " + id,
      );
    }
  }

  //Function to retrieve the weatherFlags of a user and the weather Condition
  @Get('weather/flags')
  @HikerOnly()
  @HttpCode(200)
  async userWeatherFlags(
    @CurrentUser() user: UserContext,
  ): Promise<WeatherFlagsDto[] | void[]> {
    const userHikesUnfinishedWithAlert = await this.dataSource
      .getRepository(UserHike)
      .findBy({
        userId: user.id,
        weatherNotified: false,
        finishedAt: IsNull(),
      });

    const hikeIds = userHikesUnfinishedWithAlert.map((uh) => uh.hikeId);

    const hikes = await this.service.getRepository().findBy({
      id: In(hikeIds),
    });

    const arrayOfWFlags: WeatherFlagsDto[] = [];

    hikes.forEach((hike) => {
      if (!isNil(hike.weatherStatus)) {
        arrayOfWFlags.push({
          hikeId: hike.id,
          weatherStatus: hike.weatherStatus,
          weatherDescription: hike.weatherDescription,
        });
      }
    });
    return arrayOfWFlags;
  }

  //Calculate time after which a notification must be sent to a user
  @Get('maxElapsedTime/:id')
  @HikerOnly()
  @HttpCode(200)
  async getMaxElapsedTime(
    @Param('id', ParseIdPipe()) id: ID,
    @CurrentUser() user: UserContext,
  ): Promise<UserHike | string> {
    //Count how many completed hikes has the user
    const userHikes = await this.dataSource.getRepository(UserHike).findBy({
      userId: user.id,
      finishedAt: Not(IsNull()),
    });

    const userHikeId = await this.dataSource.getRepository(UserHike).findOneBy({
      userId: user.id,
      hikeId: id,
      finishedAt: IsNull(),
    });

    if (userHikes.length >= 30) {
      const completionTimes = userHikes.map((userHike) => {
        if (!isNil(userHike.finishedAt)) {
          const endingTime = new Date(userHike.finishedAt);
          const startingTime = new Date(userHike.startedAt);
          const completionTime = endingTime.getTime() - startingTime.getTime();
          return completionTime;
        } else {
          throw new BadRequestException();
        }
      });

      completionTimes.sort((a, b) => a - b);
      const ninentyPerc =
        completionTimes[Math.floor(completionTimes.length * 0.9)];
      if (ninentyPerc) {
        const days = Math.floor(ninentyPerc / (24 * 60 * 60 * 1000));
        const newMillis = ninentyPerc % (24 * 60 * 60 * 1000);
        const hours = Math.floor(newMillis / (60 * 60 * 1000));
        const newMillis2 = newMillis % (60 * 60 * 1000);
        const minutes = Math.floor(newMillis2 / (60 * 1000));
        const newMillis3 = newMillis2 % (60 * 1000);
        const seconds = Math.floor(newMillis3 / 1000);

        const dhms =
          days.toString() +
          ' ' +
          hours.toString() +
          ':' +
          (minutes < 10 ? '0' : '') +
          minutes.toString() +
          ':' +
          (seconds < 10 ? '0' : '') +
          seconds.toString();

        await this.dataSource.getRepository(UserHike).save({
          id: userHikeId?.id,
          maxElapsedTime: dhms as any,
        });
      }
    } else {
      const expectedTime = (
        await this.service.getRepository().findOneBy({
          id,
        })
      )?.expectedTime;

      if (!isNil(expectedTime)) {
        const maxElapsedTime = expectedTime * 2 * 60 * 1000;

        const days = Math.floor(maxElapsedTime / (24 * 60 * 60 * 1000));
        const newMillis = maxElapsedTime % (24 * 60 * 60 * 1000);
        const hours = Math.floor(newMillis / (60 * 60 * 1000));
        const newMillis2 = newMillis % (60 * 60 * 1000);
        const minutes = Math.floor(newMillis2 / (60 * 1000));
        const newMillis3 = newMillis2 % (60 * 1000);
        const seconds = Math.floor(newMillis3 / 1000);

        const dhms =
          days.toString() +
          ' ' +
          hours.toString() +
          ':' +
          (minutes < 10 ? '0' : '') +
          minutes.toString() +
          ':' +
          (seconds < 10 ? '0' : '') +
          seconds.toString();

        await this.dataSource.getRepository(UserHike).save({
          id: userHikeId?.id,
          maxElapsedTime: dhms as any,
        });
      }
    }

    const userHikeStarted = await this.dataSource
      .getRepository(UserHike)
      .findOneBy({
        id: userHikeId?.id,
      });

    return userHikeStarted || 'Nothing to show';
  }

  //Evaluate which popups should be shown and update the flag
  @Get('unfinished/popupsList')
  @HikerOnly()
  @HttpCode(200)
  async getPopupsList(@CurrentUser() user: UserContext): Promise<ID[]> {
    const userHikesUnfinished = await this.dataSource
      .getRepository(UserHike)
      .findBy({
        userId: user.id,
        maxElapsedTime: Not(IsNull()),
        finishedAt: IsNull(),
        unfinishedNotified: IsNull(), //Not notified yet
      });

    //Check if there are some to be updated
    if (userHikesUnfinished.length > 0) {
      await Promise.all(
        userHikesUnfinished.map(async (userHike) => {
          if (!isNil(userHike.maxElapsedTime)) {
            const intervalObject = userHike.maxElapsedTime;
            let intervalMillis = 0;
            intervalMillis += (intervalObject.days ?? 0) * 24 * 60 * 60 * 1000;
            intervalMillis += (intervalObject.hours ?? 0) * 60 * 60 * 1000;
            intervalMillis += (intervalObject.minutes ?? 0) * 60 * 1000;
            intervalMillis += (intervalObject.seconds ?? 0) * 1000;

            const upperBound = intervalMillis + userHike.startedAt.getTime();
            if (upperBound < Date.now()) {
              //Means that the elapsed time is over the upperBound
              await this.dataSource.getRepository(UserHike).update(
                {
                  id: userHike.id,
                },
                {
                  unfinishedNotified: false,
                },
              );
            }
          }
        }),
      );
    }

    const userHikesUnfinishedIds = (
      await this.dataSource.getRepository(UserHike).findBy({
        userId: user.id,
        finishedAt: IsNull(),
        unfinishedNotified: false, //Not seen yet
      })
    ).map((userHike) => userHike.hikeId);

    return userHikesUnfinishedIds;
  }

  //Function which set the notification status OF UNFINISHED HIKE to true after that the user sees the popup
  @Get('unfinished/popupSeen/:id')
  @HikerOnly()
  @HttpCode(200)
  async unfinishedPopupSeen(
    @Param('id', ParseIdPipe()) id: ID,
    @CurrentUser() user: UserContext,
  ) {
    const update = await this.dataSource.getRepository(UserHike).findOneBy({
      hikeId: id,
      userId: user.id,
      finishedAt: IsNull(),
      unfinishedNotified: false,
    });

    if (!isNil(update)) {
      await this.dataSource.getRepository(UserHike).save({
        id: update.id,
        unfinishedNotified: true,
      });

      const userHikesUnfinishedIds = (
        await this.dataSource.getRepository(UserHike).findBy({
          userId: user.id,
          finishedAt: IsNull(),
          unfinishedNotified: false, //Not seen yet
        })
      ).map((userHike) => userHike.hikeId);

      return userHikesUnfinishedIds;
    } else {
      throw new BadRequestException(
        "You can't close a popup because there is not one related to unfinished hike: " +
          id,
      );
    }
  }

  @Get(':id')
  async getHike(@Param('id', ParseIdPipe()) id: ID): Promise<HikeFull> {
    return await this.service.getFullHike(id);
  }
}
