import {
    IsLatitude,
    IsLongitude,
    IsNumber,
    Min,
    IsEnum
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
    length!: number;
  
    @IsNumber()
    @Min(0)
    ascent!: number;
  
    @IsNumber()
    @Min(0)
    expectedTime!: number;
  
    @IsEnum(HikeDifficulty)
    difficulty!: HikeDifficulty;
  }
  