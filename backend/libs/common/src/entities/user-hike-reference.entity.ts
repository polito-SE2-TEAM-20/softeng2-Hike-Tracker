import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE } from '../constants';
import { ID } from '../types';

import { Point } from './point.entity';
import { UserHike } from './user-hike.entity';

@Entity('user_hike_reference')
export class UserHikeReference {
  @PrimaryColumn({
    type: 'integer',
    nullable: false,
  })
  userHikeId!: ID;

  @PrimaryColumn({
    type: 'integer',
    nullable: false,
  })
  pointId!: ID;

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
    foreignKeyConstraintName: 'user_hike_reference_userHikeId_fk',
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
    foreignKeyConstraintName: 'user_hike_reference_pointId_fk',
    name: 'pointId',
    referencedColumnName: 'id',
  })
  point?: Point;
}
