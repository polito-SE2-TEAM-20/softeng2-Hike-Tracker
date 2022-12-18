import { PerformanceStat } from '@app/common';

export interface UserPerformanceItem {
  stat: PerformanceStat;
  value: number | string;
  unit: string;
}

export class UserPerformance {
  stats!: UserPerformanceItem[];
}
