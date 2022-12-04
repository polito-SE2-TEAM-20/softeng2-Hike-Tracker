import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { HutLimits } from '@app/common';
import { ReferencePointDto } from '@core/hikes/hikes.dto';

export class PointWithRadius {
  @IsLatitude()
  lat!: number;

  @IsLongitude()
  lon!: number;

  @IsOptional()
  @IsNumber()
  @Min(0.00001)
  radiusKms?: number | null;
}

export class FilterHutsDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMin?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  priceMax?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  numberOfBedsMin?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  numberOfBedsMax?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => PointWithRadius)
  inPointRadius?: PointWithRadius | null;
}

export class CreateHutDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReferencePointDto)
  location?: ReferencePointDto;

  @IsNumber()
  @Min(0)
  numberOfBeds!: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  elevation?: number;

  @IsString()
  @IsOptional()
  ownerName!: string;

  @IsString()
  @IsOptional()
  website!: string;

  @IsString()
  @IsOptional()
  workingTimeStart?: string;

  @IsString()
  @IsOptional()
  workingTimeEnd?: string;
}

export class HutPicturesReorderDto {
  @IsString({ each: true })
  @MaxLength(HutLimits.picture, { each: true })
  pictures!: string[];
}
