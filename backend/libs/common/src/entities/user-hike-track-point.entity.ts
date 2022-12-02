import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE } from '../constants';
import { GPoint } from '../types';

import { BaseEntity } from './base.entity';
import { UserHike } from './user-hike.entity';

@Entity('user_hike_track_points')
export class UserHikeTrackPoint extends BaseEntity {
  @PrimaryColumn({
    type: 'integer',
    nullable: false,
  })
  userHikeId!: number;

  @PrimaryColumn({
    type: 'integer',
    nullable: false,
  })
  index!: number;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
    default: null,
  })
  position!: GPoint | null;

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
}
