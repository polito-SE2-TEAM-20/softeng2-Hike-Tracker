import { Transform } from 'class-transformer';
import { IsLatitude, IsLongitude } from 'class-validator';

export class LatLonDto {
  @IsLatitude()
  @Transform(({ value }) => +value)
  lat!: number;

  @IsLongitude()
  @Transform(({ value }) => +value)
  lon!: number;
}
