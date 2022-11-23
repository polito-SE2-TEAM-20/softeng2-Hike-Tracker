import { Hike, HikePoint, Hut, ParkingLot, Point, User } from '../entities';

export type ID = number;

export const TypeID = Number;

export type UserJwtPayload = { id: ID };
export type UserContext = Omit<User, 'password'>;

export abstract class DtoWithGroups {
  protected abstract generateGroups(): string[];
}

export type WithPoint<T> = T & { point: Point };

export type LinkedPoint =
  | {
      type: 'hut';
      entity: WithPoint<Hut>;
    }
  | {
      type: 'parkingLot';
      entity: WithPoint<ParkingLot>;
    };

export type HikeFull = Hike & {
  linkedPoints: LinkedPoint[];
  referencePoints: Point[];
  startPoint?: Point;
  endPoint?: Point;
};

export type StartEndPoint = Point & { hikePoint: HikePoint };
