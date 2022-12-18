import { Injectable } from '@nestjs/common';
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
    // calculate all stats
    const statsRaw = await this.dataSource
      .getRepository(UserHike)
      .createQueryBuilder('uh')
      .select([])
      .addSelect('count(*)', PerformanceStat.totalHikesFinished)
      .addSelect('sum(uh.psTotalKms)', PerformanceStat.totalKmsWalked)
      .addSelect(
        'max(uh.psHighestAltitude)',
        PerformanceStat.highestAltitudeReached,
      )
      .addSelect(
        'max(uh.psAltitudeRange)',
        PerformanceStat.largestAltitudeRange,
      )
      .addSelect('max(uh.psTotalKms)', PerformanceStat.longestHikeDistanceKms)
      .addSelect(
        'max(uh.psTotalTimeMinutes / 60)',
        PerformanceStat.longestHikeTimeHours,
      )
      .addSelect('min(uh.psTotalKms)', PerformanceStat.shortestHikeDistanceKms)
      .addSelect(
        'min(uh.psTotalTimeMinutes / 60)',
        PerformanceStat.shortestHikeTimeHours,
      )
      .addSelect('avg(1 / uh.psAverageSpeed)', PerformanceStat.averagePace)
      .addSelect(
        'avg(uh.psAverageVerticalAscentSpeed)',
        PerformanceStat.averageVerticalAscentSpeed,
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
        value: statsRaw[stat],
        unit: PerformanceStatUnits[perfStat],
      };
    });

    return {
      stats,
    };
  }
}
