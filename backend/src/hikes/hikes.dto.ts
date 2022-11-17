import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { HikeDifficulty, HikeLimits } from '@app/common';

export class PointWithRadius {
  @IsLatitude()
  lat!: number;

  @IsLongitude()
  lon!: number;

  @IsNumber()
  @Min(0.00001)
  radiusKms!: number;
}

export class FilteredHikesDto {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxLength?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minLength?: number;

  @IsOptional()
  @IsEnum(HikeDifficulty)
  difficultyMax?: number;

  @IsOptional()
  @IsEnum(HikeDifficulty)
  difficultyMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  expectedTimeMax?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  expectedTimeMin?: number;

  @IsOptional()
  @IsNumber()
  ascentMax?: number;

  @IsOptional()
  @IsNumber()
  ascentMin?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => PointWithRadius)
  inPointRadius?: PointWithRadius;
}

export class UpdateHikeDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  length?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  ascent?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  distance?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  expectedTime?: number;

  @IsEnum(HikeDifficulty)
  @IsOptional()
  difficulty?: HikeDifficulty;

  @IsString()
  @MaxLength(HikeLimits.title)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(HikeLimits.description)
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(HikeLimits.region)
  @IsOptional()
  region?: string;

  @IsString()
  @MaxLength(HikeLimits.province)
  @IsOptional()
  province?: string;

  @IsOptional()
  referencePoints?: Point[];
}

export class Point {
  @IsLatitude()
  lat!: number;

  @IsLongitude()
  lon!: number;

  @IsString()
  @IsOptional()
  label?: string;
}