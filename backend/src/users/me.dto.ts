import { IsEnum, IsOptional } from 'class-validator';

import { UserHikeState } from '@app/common';

export class MyTrackedHikesDto {
  @IsEnum(UserHikeState)
  @IsOptional()
  state?: UserHikeState | null;
}
