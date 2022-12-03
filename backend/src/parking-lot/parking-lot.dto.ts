import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  Min,
  ValidateNested,
  IsString,
  IsOptional,
} from 'class-validator';

import { valToNumber } from '@app/common';
import { ReferencePointDto } from '@core/hikes/hikes.dto';

export class ParkingLotDto {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => valToNumber(value))
  maxCars!: number;

  @IsString()
  @IsOptional()
  country!: string;

  @IsString()
  @IsOptional()
  region!: string;

  @IsString()
  @IsOptional()
  province!: string;

  @IsString()
  @IsOptional()
  city!: string;

  @ValidateNested()
  @Type(() => ReferencePointDto)
  location!: ReferencePointDto;
}
