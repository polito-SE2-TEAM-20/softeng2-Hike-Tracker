import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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
    nullable: false,
  })
  position!: GPoint;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  address!: string | null;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  name!: string | null;

  /**
   * For TypeORM metadata only
   * @deprecated
   */
  __joiner?: any;
}
