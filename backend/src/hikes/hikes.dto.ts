import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { isNil } from 'ramda';

import {
  DtoWithGroups,
  HikeDifficulty,
  HikeLimits,
  ID,
  IsIdentifier,
  PointLimits,
  transformToClass,
  valToNumber,
} from '@app/common';
import { HikeCondition } from '@app/common/enums/hike-condition.enum';
import { HikeWeather } from '@app/common/enums/weatherStatus.enum';

import { StartEndPointTransformer } from './hikes.utils';

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
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxLength?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minLength?: number;

  //filter on hike condition to be added, maybe

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

export class ReferencePointDto {
  @IsString()
  @IsOptional()
  @MaxLength(PointLimits.name)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(PointLimits.address)
  address?: string;

  @IsLatitude()
  @Transform(({ value }) => valToNumber(value))
  lat!: number;

  @IsLongitude()
  @Transform(({ value }) => valToNumber(value))
  lon!: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => valToNumber(value))
  altitude?: number | null;
}

export class StartEndPointDto extends DtoWithGroups {
  protected generateGroups(): string[] {
    if (!isNil(this.hutId)) return ['hut'];
    if (!isNil(this.parkingLotId)) return ['parkingLot'];
    if (!isNil(this.name)) return ['name'];
    if (!isNil(this.address)) return ['address'];
    if (!isNil(this.lat)) return ['position'];

    throw new Error('name, address, or lat/lon should be defined');
  }

  @IsOptional()
  @IsIdentifier({ groups: ['hut'] })
  hutId?: ID | null;

  @IsOptional()
  @IsIdentifier({ groups: ['parkingLot'] })
  parkingLotId?: ID | null;

  @IsString({ groups: ['name'] })
  @IsNotEmpty({ groups: ['name'] })
  @IsOptional()
  @MaxLength(PointLimits.name)
  name?: string;

  @IsString({ groups: ['address'] })
  @IsNotEmpty({ groups: ['address'] })
  @IsOptional()
  @MaxLength(PointLimits.address)
  address?: string;

  @IsOptional()
  @IsNotEmpty({ groups: ['position'] })
  @IsLatitude({ groups: ['position'] })
  @Transform(({ value }) => valToNumber(value))
  lat!: number;

  @IsOptional()
  @IsNotEmpty({ groups: ['position'] })
  @IsLongitude({ groups: ['position'] })
  @Transform(({ value }) => valToNumber(value))
  lon!: number;
}

export class HikeDto {
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => valToNumber(value))
  length!: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => valToNumber(value))
  ascent!: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => valToNumber(value))
  expectedTime!: number;

  @IsEnum(HikeDifficulty)
  @Transform(({ value }) => parseInt(value))
  difficulty!: HikeDifficulty;

  @IsEnum(HikeCondition)
  @Transform(({ value }) => parseInt(value))
  condition!: HikeCondition;

  @IsOptional()
  @IsString()
  @MaxLength(HikeLimits.cause)
  cause?: string;

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

  @IsString()
  @MaxLength(HikeLimits.city)
  city!: string;

  @IsString()
  @MaxLength(HikeLimits.country)
  country!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferencePointDto)
  @Transform(
    ({ value }) => {
      if (typeof value !== 'string') {
        return value;
      }

      return transformToClass(ReferencePointDto, JSON.parse(value));
    },
    { toClassOnly: true },
  )
  referencePoints!: ReferencePointDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => StartEndPointDto)
  @StartEndPointTransformer()
  startPoint?: StartEndPointDto | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => StartEndPointDto)
  @StartEndPointTransformer()
  endPoint?: StartEndPointDto | null;
}

export class LinkedPointDto extends DtoWithGroups {
  protected generateGroups() {
    if (this.hutId) {
      return ['hut'];
    }
    if (this.parkingLotId) {
      return ['parkingLot'];
    }

    throw new Error('hutId or parkingLotId should be defined');
  }

  @IsIdentifier({ groups: ['hut'] })
  @IsOptional({ groups: ['parkingLot'] })
  hutId!: ID;

  @IsIdentifier({ groups: ['parkingLot'] })
  @IsOptional({ groups: ['hut'] })
  parkingLotId!: ID;
}

export class UpdateHikeDto extends OmitType(PartialType(HikeDto), [
  'referencePoints',
  'startPoint',
  'endPoint',
] as const) {
  @IsString({ each: true })
  @MaxLength(HikeLimits.picture, { each: true })
  @IsOptional()
  pictures?: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReferencePointDto)
  referencePoints?: ReferencePointDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => StartEndPointDto)
  startPoint?: StartEndPointDto | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => StartEndPointDto)
  endPoint?: StartEndPointDto | null;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => LinkedPointDto)
  // startPoint?: LinkedPointDto | null;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => LinkedPointDto)
  // endPoint?: LinkedPointDto | null;
}

export class LinkHutToHikeDto {
  @IsIdentifier()
  hikeId!: ID;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => LinkedPointDto)
  linkedPoints!: LinkedPointDto[];
}

export class WeatherInRangeDto {
  @ValidateNested()
  @Type(() => PointWithRadius)
  inPointRadius!: PointWithRadius;

  @IsEnum(HikeWeather)
  weatherStatus!: HikeWeather;

  @IsOptional()
  @IsString()
  @MaxLength(HikeLimits.description)
  weatherDescription?: string | null;
}

export class WeatherFlagsDto {
  @IsIdentifier()
  hikeId!: ID;

  @IsEnum(HikeWeather)
  weatherStatus!: HikeWeather;

  @IsOptional()
  @IsString()
  @MaxLength(HikeLimits.description)
  weatherDescription?: string | null;
}
