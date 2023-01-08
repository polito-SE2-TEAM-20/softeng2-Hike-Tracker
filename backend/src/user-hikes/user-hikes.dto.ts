import { IsDateString } from 'class-validator';

import { ID, IsIdentifier } from '@app/common';

export class StartHikeDto {
  @IsIdentifier()
  hikeId!: ID;
}

export class TrackPointDto {
  @IsIdentifier()
  pointId!: ID;

  @IsDateString()
  datetime!: string;
}
