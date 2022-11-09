import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { PointType } from '../enums';

@Entity('points')
export class Point {
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @Column({
    type: 'smallint',
    nullable: false,
    default: PointType.point,
  })
  type!: PointType;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  position!: any;

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
