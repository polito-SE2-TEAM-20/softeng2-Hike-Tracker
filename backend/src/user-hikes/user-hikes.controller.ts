import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull } from 'typeorm';

import {
  CurrentUser,
  HikePoint,
  HikerOnly,
  ID,
  ParseIdPipe,
  PointType,
  RolesOnly,
  UserContext,
  UserRole,
} from '@app/common';
import { HikesService } from '@core/hikes/hikes.service';
import { PointsService } from '@core/points/points.service';

import { UserHikeTrackPointsService } from './user-hike-track-points.service';
import { StartHikeDto, TrackPointDto } from './user-hikes.dto';
import { UserHikeFull } from './user-hikes.interface';
import { UserHikesService } from './user-hikes.service';

@Controller('user-hikes')
export class UserHikesController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private service: UserHikesService,
    private hikesService: HikesService,
    private pointsService: PointsService,
    private userHikeTrackPointsService: UserHikeTrackPointsService,
  ) {}

  @RolesOnly(
    UserRole.hiker,
    UserRole.emergencyOperator,
    UserRole.friend,
    UserRole.platformManager,
  )
  @Get(':id')
  async getHike(@Param('id', ParseIdPipe()) id: ID): Promise<UserHikeFull> {
    return await this.service.getFullUserHike(id);
  }

  @HikerOnly()
  @Post('start')
  @HttpCode(HttpStatus.OK)
  async startHike(
    @Body() { hikeId }: StartHikeDto,
    @CurrentUser() user: UserContext,
  ): Promise<UserHikeFull> {
    await this.hikesService.ensureExistsOrThrow(hikeId);

    // make sure they don't already have a hike started
    const existingHike = await this.service.getRepository().findOneBy({
      hikeId,
      userId: user.id,
      finishedAt: IsNull(),
    });

    if (existingHike) {
      throw new BadRequestException(
        `Found user hike in progress: ${existingHike.id}. Please finish it first.`,
      );
    }

    const userHike = await this.service.create({
      userId: user.id,
      hikeId,
    });

    return await this.service.getFullUserHike(userHike.id);
  }

  @HikerOnly()
  @Post(':id/track-point')
  @HttpCode(HttpStatus.OK)
  async trackHikePoint(
    @Body() { pointId, datetime }: TrackPointDto,
    @CurrentUser() user: UserContext,
    @Param('id', ParseIdPipe()) id: ID,
  ): Promise<UserHikeFull> {
    const userHike = await this.service.findByIdAndValidatePermissions(
      id,
      user,
    );

    if (!!userHike.finishedAt) {
      throw new BadRequestException('Hike is finished');
    }

    const point = await this.pointsService.findByIdOrThrow(pointId);
    // ensure such reference point exists
    const referenceCount = await this.pointsService
      .getRepository()
      .createQueryBuilder('p')
      .innerJoin(
        HikePoint,
        'hp',
        '(hp.pointId = p.id and hp.type = :type and hp.hikeId = :hikeId)',
        { type: PointType.referencePoint, hikeId: userHike.hikeId },
      )
      .andWhere('p.id = :pointId', { pointId })
      .getCount();

    if (!referenceCount) {
      throw new BadRequestException(
        'This point is not a reference point for this hike',
      );
    }

    // insert new point into db
    await this.dataSource.transaction(async (entityManager) => {
      const lastPoint = await this.userHikeTrackPointsService
        .getRepository(entityManager)
        .findOne({ where: { userHikeId: id }, order: { index: 'desc' } });
      const index = lastPoint ? lastPoint.index + 1 : 1;

      await this.userHikeTrackPointsService.create(
        {
          index,
          userHikeId: userHike.id,
          pointId: point.id,
          datetime: new Date(datetime),
        },
        entityManager,
      );

      // update the user hike
      await this.service
        .getRepository(entityManager)
        .update({ id }, { updatedAt: new Date() });
    });

    return await this.service.getFullUserHike(id);
  }

  @HikerOnly()
  @Post(':id/finish')
  @HttpCode(HttpStatus.OK)
  async finishHike(
    @CurrentUser() user: UserContext,
    @Param('id', ParseIdPipe()) id: ID,
  ): Promise<UserHikeFull> {
    await this.service.findByIdAndValidatePermissions(id, user);

    await this.service
      .getRepository()
      .update({ id }, { finishedAt: new Date() });

    return await this.service.getFullUserHike(id);
  }
}
