import { IsLatitude, IsLongitude } from 'class-validator';

export class LatLonDto {
  @IsLatitude()
  lat!: number;

  @IsLongitude()
  lon!: number;
}
