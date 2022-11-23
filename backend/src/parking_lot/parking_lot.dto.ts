import { IsNumber, Min, ValidateNested } from 'class-validator';
import { Transform } from 'class-transformer';
import { valToNumber } from '@app/common';
import { Type } from 'class-transformer';
import { ReferencePointDto } from '@core/hikes/hikes.dto';
  

export class ParkingLotDto {
    // @IsNumber()
    // @Min(1)
    // @Transform(({ value }) => valToNumber(value))
    // pointId!: number;
  
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => valToNumber(value))
    maxCars!: number;

    @ValidateNested()
    @Type(() => ReferencePointDto)
    location?: ReferencePointDto;
}