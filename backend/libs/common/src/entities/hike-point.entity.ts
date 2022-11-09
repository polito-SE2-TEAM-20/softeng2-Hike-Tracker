import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE } from '../constants';

import { Hike } from './hike.entity';
import { Point } from './point.entity';

@Entity('hike_points')
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
    name: 'pointId',
    referencedColumnName: 'id',
  })
  point?: Point;
}
