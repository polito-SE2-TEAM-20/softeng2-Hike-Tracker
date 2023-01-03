import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  Min,
  IsEnum,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';

import { HikeDifficulty } from '@app/common';

export class PreferencesDto {
  @IsOptional()
  @IsLatitude()
  lat!: number;

  @IsOptional()
  @IsLongitude()
  lon!: number;

  @IsOptional()
  @IsNumber()
  @Min(0.00001)
  radiusKms!: number;

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
  @IsBoolean()
  suggestionType?: boolean;
}
