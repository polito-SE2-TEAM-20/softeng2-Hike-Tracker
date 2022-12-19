import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { numericOptionsConfig, PointLimits } from '../constants';
import { PointType } from '../enums';
import { GPoint } from '../types';

@Entity('points')
@Index('points_position_idx', ['position'], { spatial: true })
export class Point {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'smallint',
    nullable: false,
    default: PointType.point,
  })
  type!: PointType;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
    default: null,
  })
  position!: GPoint | null;

  @Column({
    type: 'varchar',
    length: PointLimits.address,
    nullable: true,
  })
  address!: string | null;

  @Column({
    type: 'varchar',
    length: PointLimits.name,
    nullable: true,
  })
  name!: string | null;

  /**
   * meters
   */
  @Column({
    ...numericOptionsConfig(null),
    nullable: true,
  })
  altitude!: number | null;

  /**
   * For TypeORM metadata only
   * @deprecated
   */
  __joiner?: any;
}
