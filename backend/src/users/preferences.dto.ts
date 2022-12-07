import {
    IsLatitude,
    IsLongitude,
    IsNumber,
    Min,
    IsEnum,
    IsInt,
    IsBoolean
  } from 'class-validator';

import { HikeDifficulty } from '@app/common';


export class PreferencesDto {
    @IsLatitude()
    lat!: number;
  
    @IsLongitude()
    lon!: number;
  
    @IsNumber()
    @Min(0.00001)
    radiusKms!: number;

    @IsNumber()
    @Min(0)
    maxLength?: number;
  
    @IsNumber()
    @Min(0)
    minLength?: number;
  
    @IsEnum(HikeDifficulty)
    difficultyMax?: number;
  
    @IsEnum(HikeDifficulty)
    difficultyMin?: number;
  
    @IsInt()
    @Min(0)
    expectedTimeMax?: number;
  
    @IsInt()
    @Min(0)
    expectedTimeMin?: number;

    @IsNumber()
    ascentMax?: number;
  
    @IsNumber()
    ascentMin?: number;

    @IsBoolean()
    suggestionType?: boolean;
  }
  