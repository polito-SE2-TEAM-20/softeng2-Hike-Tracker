import { Injectable } from '@nestjs/common';
import { isNil } from 'ramda';
import { DataSource } from 'typeorm';

import {
  PerformanceStat,
  PerformanceStatUnits,
  UserContext,
  UserHike,
} from '@app/common';
import { HikesService } from '@core/hikes/hikes.service';

import { UserPerformance, UserPerformanceItem } from './users.schema';

@Injectable()
export class UsersStatsService {
  private readonly statsCalculators: Record<
    PerformanceStat,
    (user: UserContext) => Promise<UserPerformanceItem>
  > = {} as any;

  constructor(
    private dataSource: DataSource,
    private hikesService: HikesService,
  ) {}

  async calculateUserStats({
    id: userId,
  }: UserContext): Promise<UserPerformance> {
    const double = 'numeric(12, 2)';
    const rounder = 'round';
    const decimals = 4;

    // calculate all stats
    const statsRaw = await this.dataSource
      .getRepository(UserHike)
      .createQueryBuilder('uh')
      .select([])
      .addSelect(
        `${rounder}(avg(uh.psAverageSpeed)::${double}, ${decimals})::${double}`,
        PerformanceStat.averagePace,
      )
      .addSelect(
        `${rounder}(avg(uh.psAverageVerticalAscentSpeed)::${double}, ${decimals})::${double}`,
        PerformanceStat.averageVerticalAscentSpeed,
      )
      .addSelect(
        `${rounder}(max(uh.psAverageSpeed)::${double}, ${decimals})::${double}`,
        PerformanceStat.fastestPace,
      )
      .addSelect(
        `${rounder}(max(uh.psHighestAltitude)::${double}, ${decimals})::${double}`,
        PerformanceStat.highestAltitudeReached,
      )
      .addSelect(
        `${rounder}(max(uh.psAltitudeRange)::${double}, ${decimals})::${double}`,
        PerformanceStat.largestAltitudeRange,
      )
      .addSelect(
        `${rounder}(max(uh.psTotalKms)::${double}, ${decimals})::${double}`,
        PerformanceStat.longestHikeDistanceKms,
      )
      .addSelect(
        `${rounder}(max(uh.psTotalTimeMinutes / 60)::${double}, ${decimals})::${double}`,
        PerformanceStat.longestHikeTimeHours,
      )
      .addSelect(
        `${rounder}(min(uh.psTotalKms)::${double}, ${decimals})::${double}`,
        PerformanceStat.shortestHikeDistanceKms,
      )
      .addSelect(
        `${rounder}(min(uh.psTotalTimeMinutes / 60)::${double}, ${decimals})::${double}`,
        PerformanceStat.shortestHikeTimeHours,
      )
      .addSelect('count(*)::integer', PerformanceStat.totalHikesFinished)
      .addSelect(
        `${rounder}(sum(uh.psTotalKms)::${double}, ${decimals})::${double}`,
        PerformanceStat.totalKmsWalked,
      )
      .andWhere('uh.userId = :userId', { userId })
      .andWhere('uh.finishedAt is not null')
      .getRawOne();

    const stats: UserPerformanceItem[] = Object.keys(
      statsRaw,
    ).map<UserPerformanceItem>((stat) => {
      const perfStat = stat as PerformanceStat;
      return {
        stat: perfStat,
        value:
          typeof statsRaw[stat] === 'number' || isNil(statsRaw[stat])
            ? statsRaw[stat]
            : parseFloat(statsRaw[stat]),
        unit: PerformanceStatUnits[perfStat],
      };
    });

    return {
      stats,
    };
  }
}
