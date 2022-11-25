import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { PointWithRadius, ReferencePointDto } from '@core/hikes/hikes.dto';

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
  inPointRadius?: PointWithRadius;
}

export class CreateHutDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

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
}
