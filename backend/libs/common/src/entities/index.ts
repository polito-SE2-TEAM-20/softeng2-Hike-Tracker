import { HikePoint } from './hike-point.entity';
import { Hike } from './hike.entity';
import { Hut } from './hut.entity';
import { ParkingLot } from './parking-lot.entity';
import { Point } from './point.entity';
import { User } from './user.entity';

export * from './user.entity';
export * from './hike-point.entity';
export * from './hike.entity';
export * from './point.entity';
export * from './parking-lot.entity';
export * from './hut.entity';

export const entities = [User, HikePoint, Hike, Hut, ParkingLot, Point];
