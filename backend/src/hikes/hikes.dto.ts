import { PartialType } from '@nestjs/mapped-types';
import { Type, Transform } from 'class-transformer';
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

import {
  HikeDifficulty,
  HikeLimits,
  LatLonDto,
  PointLimits,
} from '@app/common';

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

export class ReferencePointDto extends LatLonDto {
  @IsString()
  @IsOptional()
  @MaxLength(PointLimits.name)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(PointLimits.address)
  address!: string;
}

export class HikeDto {
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => +value)
  length!: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => +value)
  ascent!: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => +value)
  expectedTime!: number;

  @IsEnum(HikeDifficulty)
  @Transform(({ value }) => parseInt(value))
  difficulty!: HikeDifficulty;

  @IsString()
  @MaxLength(HikeLimits.title)
  title!: string;

  @IsString()
  @MaxLength(HikeLimits.description)
  description!: string;

  @IsString()
  @MaxLength(HikeLimits.region)
  region!: string;

  @IsString()
  @MaxLength(HikeLimits.province)
  province!: string;

  @ValidateNested({ each: true })
  @Type(() => ReferencePointDto)
  referencePoints!: ReferencePointDto[];
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
export class UpdateHikeDto extends PartialType(HikeDto) {}
