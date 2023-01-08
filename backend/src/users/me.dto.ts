import { IsEnum, IsOptional, IsNumber } from 'class-validator';

import { UserHikeState } from '@app/common';

export class MyTrackedHikesDto {
  @IsEnum(UserHikeState)
  @IsOptional()
  state?: UserHikeState | null;
}

export class PlannedHikesDto {
  @IsNumber({}, { each: true })
  plannedHikes?: number[];
}
