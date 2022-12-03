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
  ParseIntPipe,
  HttpCode,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs-extra';
import { isNil, propEq } from 'ramda';
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
  mapToId,
  orderEntities,
  ParkingLot,
  Point,
  PointType,
  UserContext,
} from '@app/common';
import { GpxService } from '@app/gpx';

import { PointsService } from '../points/points.service';

import { hikeFilters } from './hikes.constants';
import {
  FilteredHikesDto,
  HikeDto,
  LinkHutToHikeDto,
  UpdateHikeDto,
} from './hikes.dto';
import { HikesService } from './hikes.service';
import { HikeCondition } from '@app/common/enums/hike-condition.enum';

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

      if (maybeFilter && !isNil(body[filterKey])) {
        whereConditions.push(
          `h."${maybeFilter.entityField}" ${
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
      where ${whereConditions.length ? whereConditions.join(' AND ') : 'true'}
      order by h.id asc
    `;

    const rawHikes: Hike[] = await this.service
      .getRepository()
      .query(queryRaw, params);
    const hikeIds = mapToId(rawHikes);
    const hikes = await this.service
      .getRepository()
      .findBy({ id: In(hikeIds) });
    const orderedHikes = orderEntities(hikes, hikeIds, propEq('id'));

    return orderedHikes;
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

    const points = await this.dataSource
      .getRepository(Point)
      .createQueryBuilder('p')
      .orWhere((qb) => {
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
      .orWhere((qb) => {
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

    await this.dataSource.transaction(async (entityManager) => {
      // remove all existing links
      await entityManager.getRepository(HikePoint).delete({
        hikeId,
        type: PointType.linkedPoint,
      });

      // save new links
      await entityManager.getRepository(HikePoint).save(
        points.map<Partial<HikePoint>>(({ id: pointId }, index) => ({
          index,
          hikeId,
          pointId,
          type: PointType.linkedPoint,
        })),
      );
    });

    return await this.service.getFullHike(hikeId);
  }

  @Put(':id')
  @LocalGuideOnly()
  async updateHike(
    @Param('id') id: ID,
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
          type: 0,
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

    await this.service.getRepository().update({ id }, data);

    return await this.service.getFullHike(id);
  }

  @Put('condition/:id')
  @HutWorkerOnly()
  async updateHikeCondition(
    @Param('id') id: ID,
    @CurrentUser() user: UserContext,
    @Body()
    {
      condition,
      cause,
    },
  ): Promise<Hike> {

    //If the condition to be updated is not 'Open' a cause/description MUST be provided
    if(condition !== HikeCondition.open && isNil(cause)){
      throw new BadRequestException("If the condition is not open you MUST provide a cause or a description of the problem.");
    }

    //Need all huts IDs to look up and see if a point in the trail is a hut
    const allHutIDs = (await this.dataSource.getRepository(Hut).find()).map(hut => hut.pointId);

    //to delete
    console.log(allHutIDs);

    //Check to see if there are huts on the chosen hike
    const checkIfThereAreHuts = await this.dataSource.getRepository(HikePoint).findBy({
      hikeId: id,
      //pointId: In(allHutIDs),
      //type: In([PointType.linkedPoint, PointType.startPoint, PointType.endPoint])
    });

    //to delete
    console.log(checkIfThereAreHuts);

    //If there are no huts the hut worker is not authorized to change hike condition
    if(checkIfThereAreHuts.length === 0){
      throw new BadRequestException('You are not authorized to change this condition since there are not Huts of your property.');
    }
    
    //retrieve hut's pointIDs by the hikepoints of the chosen hike
    const hutsId = checkIfThereAreHuts.map(hikePoint => hikePoint.pointId);

    //check if the hut worker works in one of the huts on the hike trail
    const checkHutsProperty = await this.dataSource.getRepository(HutWorker).findBy({
      hutId: In(hutsId),
      userId: user.id
    });

    //If the hut work does not work in one of the huts return error
    if(checkHutsProperty.length === 0){
      throw new BadRequestException('You are not authorized to change this condition since there are not Huts in which you work on this trail.');
    }

    //If an exception has not been thrown before, update the condition and the cause
    return await this.service.getRepository().save({
      id: id,
      condition: condition,
      cause: cause || ""
    });
  }


  //Used to gett all the hikes that current hut worker (user)
  //can update conditions
  @Get('hutWorkerHikes')
  @HutWorkerOnly()
  async getHutWorkerHikes(
    @CurrentUser() user: UserContext
  ) : Promise<Hike[]>{

    //Retrieve all the hutsIDs given the hut worker
    const myHuts = (await this.dataSource.getRepository(HutWorker).findBy({
      userId: user.id,
    })).map(hutWorker => hutWorker.hutId);

    //Retrieve all the pointIDs related to previous Huts
    const myHutPoints = (await this.dataSource.getRepository(Hut).findBy({
      id: In(myHuts)
    })).map(hut => hut.pointId);

    //Retrieve all the hikeIDs which are related to the huts got before
    const validHikes = (await this.dataSource.getRepository(HikePoint).findBy({
      pointId: In(myHutPoints)
    })).map(hikePoint => hikePoint.hikeId);

    //Return all the hikes which have a hut on their trail whose the hut worker is the user
    return await this.service.getRepository().findBy({
      id: In(validHikes)
    });
  }
  
  @Delete(':id')
  @LocalGuideOnly()
  @HttpCode(200)
  async deleteHike(
    @Param('id') id: ID,
    @CurrentUser() user: UserContext,
  ): Promise<{rowsAffected: number}> {
    
    const hikeOwner = (await this.service.getRepository().findOneBy({
      id: id
    }))?.userId;

    if(hikeOwner !== user.id){
      throw new BadRequestException('This local guide can not delete this hike.');
    }

    const pointsToDelete = await this.dataSource.getRepository(HikePoint).findBy({
      hikeId: id
    });
    
    const deletion = await this.service.getRepository().delete({
      id: id,
    });

    if(deletion.affected === 0 || isNil(deletion.affected)){
      throw new BadRequestException('Hike not found.');
    }

    const pointsID = pointsToDelete.map((point) => point.pointId);
    
    await this.pointsService.getRepository().delete({
      id: In(pointsID),
    });

    return {rowsAffected: deletion.affected};
  }

  @Get(':id')
  async getHike(@Param('id', new ParseIntPipe()) id: ID): Promise<HikeFull> {
    return await this.service.getFullHike(id);
  }

}
