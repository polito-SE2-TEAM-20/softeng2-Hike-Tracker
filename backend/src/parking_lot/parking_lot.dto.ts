import { IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { valToNumber } from '@app/common';
  

export class ParkingLotDto {
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => valToNumber(value))
    pointId!: number;
  
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => valToNumber(value))
    maxCars!: number;
}