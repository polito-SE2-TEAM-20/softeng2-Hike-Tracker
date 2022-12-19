import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE } from '../constants';
import { ID } from '../types';

import { Point } from './point.entity';
import { UserHike } from './user-hike.entity';

@Entity('user_hike_track_points')
export class UserHikeTrackPoint {
  @PrimaryColumn({
    type: 'integer',
    nullable: false,
  })
  userHikeId!: ID;

  @Column({
    type: 'integer',
    nullable: false,
  })
  pointId!: ID;

  @PrimaryColumn({
    type: 'integer',
    nullable: false,
  })
  index!: number;

  // @Column({
  //   type: 'geography',
  //   spatialFeatureType: 'Point',
  //   srid: 4326,
  //   nullable: true,
  //   default: null,
  // })
  // position!: GPoint | null;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
    default: () => 'now()',
  })
  datetime!: Date;

  /**
   * TypeORM sql-gen only
   * @deprecated
   */
  @ManyToOne(
    () => UserHike,
    (entity) => entity.__joiner,
    FOREIGN_OPTIONS_CASCADE,
  )
  @JoinColumn({
    foreignKeyConstraintName: 'user_hike_track_points_userHikeId_fk',
    name: 'userHikeId',
    referencedColumnName: 'id',
  })
  userHike?: UserHike;

  /**
   * TypeORM sql-gen only
   * @deprecated
   */
  @ManyToOne(() => Point, (entity) => entity.__joiner, FOREIGN_OPTIONS_CASCADE)
  @JoinColumn({
    foreignKeyConstraintName: 'user_hike_track_points_pointId_fk',
    name: 'pointId',
    referencedColumnName: 'id',
  })
  point?: Point;
}
