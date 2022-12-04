import { UserHike, UserHikeTrackPoint } from '@app/common';

export type UserHikePk = 'hikeId' | 'userId';

export type UserHikeFull = UserHike & {
  trackPoints: UserHikeTrackPoint[];
};
