import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE } from '../constants';
import { PointType } from '../enums';

import { Hike } from './hike.entity';
import { Point } from './point.entity';

@Entity('hike_points')
@Index('hike_points_hikeId_index_idx', ['hikeId', 'index'])
export class HikePoint {
  @PrimaryColumn({
    type: 'integer',
    nullable: false,
  })
  hikeId!: number;

  @PrimaryColumn({
    type: 'integer',
    nullable: false,
  })
  pointId!: number;

  @PrimaryColumn({
    type: 'smallint',
    nullable: false,
    default: PointType.point,
  })
  type!: PointType;

  /**
   * 0 - start point
   * order DESC limit 1 - end point
   * all other indices are referece points
   */
  @Column({
    type: 'integer',
    nullable: false,
  })
  index!: number;

  /**
   * TypeORM sql-gen only
   * @deprecated
   */
  @ManyToOne(() => Hike, (entity) => entity.__joiner, FOREIGN_OPTIONS_CASCADE)
  @JoinColumn({
    foreignKeyConstraintName: 'hike_points_hikeId_fk',
    name: 'hikeId',
    referencedColumnName: 'id',
  })
  hike?: Hike;

  /**
   * TypeORM sql-gen only
   * @deprecated
   */
  @ManyToOne(() => Point, (entity) => entity.__joiner, FOREIGN_OPTIONS_CASCADE)
  @JoinColumn({
    foreignKeyConstraintName: 'hike_points_pointId_fk',
    name: 'pointId',
    referencedColumnName: 'id',
  })
  point?: Point;
}

export type HikePointPrimaryKey = 'hikeId' | 'pointId';
