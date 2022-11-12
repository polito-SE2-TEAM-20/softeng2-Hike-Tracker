import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { HikeDifficulty, HikeLimits } from '@app/common';

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
}
