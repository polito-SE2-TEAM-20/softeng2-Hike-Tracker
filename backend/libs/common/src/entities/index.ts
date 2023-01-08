import { CodeHike } from './code-hike.entity';
import { HikePoint } from './hike-point.entity';
import { Hike } from './hike.entity';
import { HutWorker } from './hut-worker.entity';
import { Hut } from './hut.entity';
import { ParkingLot } from './parking-lot.entity';
import { Point } from './point.entity';
import { UserHikeTrackPoint } from './user-hike-track-point.entity';
import { UserHike } from './user-hike.entity';
import { User } from './user.entity';

export * from './user.entity';
export * from './hike-point.entity';
export * from './hike.entity';
export * from './point.entity';
export * from './parking-lot.entity';
export * from './user-hike.entity';
export * from './user-hike-track-point.entity';
export * from './hut.entity';
export * from './hut-worker.entity';
export * from './code-hike.entity';

export const entities = [
  User,
  HikePoint,
  Hike,
  Hut,
  ParkingLot,
  Point,
  HutWorker,
  UserHike,
  UserHikeTrackPoint,
  CodeHike,
];
