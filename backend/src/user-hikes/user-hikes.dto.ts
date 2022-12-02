import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ID, IsIdentifier, LatLonDto } from '@app/common';

export class StartHikeDto {
  @IsIdentifier()
  hikeId!: ID;
}

export class TrackPointDto {
  @ValidateNested()
  @Type(() => LatLonDto)
  position!: LatLonDto;
}
