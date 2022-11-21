import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type, Transform } from 'class-transformer';
import {
  IsArray,
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
  DtoWithGroups,
  HikeDifficulty,
  HikeLimits,
  ID,
  IsIdentifier,
  PointLimits,
  valToNumber,
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferencePointDto)
  @Transform(
    ({ value }) => {
      if (typeof value !== 'string') {
        return value;
      }

      return JSON.parse(value).map((entry: any) => {
        const dto = new ReferencePointDto();

        Object.entries(entry).forEach(([key, v]) => {
          dto[key] = v;
        });

        return dto;
      });
    },
    { toClassOnly: true },
  )
  referencePoints!: ReferencePointDto[];
}

export class UpdateHikeDto extends OmitType(PartialType(HikeDto), [
  'referencePoints',
] as const) {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReferencePointDto)
  referencePoints?: ReferencePointDto[];
}

class LinkedPointDto extends DtoWithGroups {
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

export class LinkHutToHikeDto {
  @IsIdentifier()
  hikeId!: ID;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => LinkedPointDto)
  linkedPoints!: LinkedPointDto[];
}
