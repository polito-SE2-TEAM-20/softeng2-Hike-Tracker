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
  tableNameSchemed,
  UserContext,
  UserHike,
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
    private service: UserHikesService,
    private hikesService: HikesService,
    private pointsService: PointsService,
    @InjectDataSource() private dataSource: DataSource,
    private userHikeTrackPointsService: UserHikeTrackPointsService,
  ) {}

  @RolesOnly(
    UserRole.hiker,
    UserRole.emergencyOperator,
    UserRole.friend,
    UserRole.platformManager,
  )
  @Get('reached-points')
  @HikerOnly()
  @HttpCode(200)
  async getReachedReferencePoints(
    @CurrentUser() user: UserContext,
  ): Promise<UserHikeFull> {
    return await this.userHikeTrackPointsService.getReachedReferencePoints(
      user.id,
    );
  }

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
    const userHike = await this.service.findByIdAndValidatePermissions(
      id,
      user,
    );

    // prepare final data to store hike stats
    // total kms walked - distance(TrackPoint.point.position)
    // highest altitude - max(TrackPoint.point.altitude)
    // altitude range - abs(max(TrackPoint.point.altitude) - min(TrackPoint.point.altitude))
    // total time - (finishedAt - startedAt), store as duration?
    // average speed (sum(kms walked) / total time)
    // average vertical ascent speed - avg(distance(curr, prev) / (time - prev.time))
    // ** only on points where altitude > prev.altitude (lag 1)

    const updateData: Partial<UserHike> = { finishedAt: new Date() };
    await this.service.getRepository().update({ id }, updateData);

    const [statsRaw]: [
      {
        totalDistanceKms: number;
        totalTimeMinutes: number;
        psHighestAltitude: number;
        psAltitudeRange: number;
        psAverageSpeedKmsMin: number;
        averageAscentSpeedMetresPerHour: number;
      },
    ] = await this.dataSource.query(
      `
      with totals as (
        select
          (sum(ST_Distance(sq.position, sq.prev_pos)) over ()) / 1000 as "totalDistanceKms",
          (sum(ST_Distance(sq.position, sq.prev_pos)) over ()) as "totalDistanceMeters",
          sq.total_time_minutes as "totalTimeMinutes",
          max(sq.altitude) over () as "psHighestAltitude",
          abs(sq.max_altitude - sq.min_altitude) as "psAltitudeRange",
          sq.*
        from (
          select
            p.*,
            uhtp.index,
            uhtp.datetime as datetime,
            lag(p.position, 1) over w as prev_pos,
            lag(p.altitude, 1) over w as prev_altitude,
            p.altitude as curr_altitude,
            p.altitude - lag(p.altitude) over w as altitude_diff,
            lag(uhtp.datetime, 1) over w as prev_datetime,
            extract(epoch from uhtp.datetime - lag(uhtp.datetime) over w) / 60 as duration_minutes,
            max(p.altitude) over () as max_altitude,
            min(p.altitude) over () as min_altitude,
            (extract(epoch from (uh."finishedAt" - uh."startedAt")) / 60) as total_time_minutes
          from ${tableNameSchemed('user_hike_track_points')} uhtp
          inner join ${tableNameSchemed('user_hikes')} uh on (uh.id = $1)
          inner join ${tableNameSchemed('points')} p on p.id = uhtp."pointId"
          where uhtp."userHikeId" = $1
          window w as (order by uhtp.index asc)
          order by uhtp.index asc
        ) sq
      ),
      speeds as (
        select
          totals.*,
          ("totalDistanceKms") / (total_time_minutes) as "psAverageSpeedKmsMin",
          1 / ("totalDistanceKms" / total_time_minutes) as "psAverageSpeedMinPerKm"
        from totals
      )
      select
        speeds.*,
        (select
            (sum(altitude_diff) over () / sum(duration_minutes) over ()) / 60 as "averageAscentSpeedMetresPerHour"
          from speeds
          where altitude_diff > 0
          limit 1
        ) as "averageAscentSpeedMetresPerHour"
      from speeds
      `,
      [userHike.id],
    );

    if (statsRaw) {
      await this.service.getRepository().update(
        { id },
        {
          psTotalKms: statsRaw.totalDistanceKms,
          psAltitudeRange: statsRaw.psAltitudeRange,
          psTotalTimeMinutes: statsRaw.totalTimeMinutes,
          psAverageSpeed: statsRaw.psAverageSpeedKmsMin,
          psAverageVerticalAscentSpeed:
            statsRaw.averageAscentSpeedMetresPerHour,
          psHighestAltitude: statsRaw.psHighestAltitude,
        },
      );
    }

    return await this.service.getFullUserHike(id);
  }
}
