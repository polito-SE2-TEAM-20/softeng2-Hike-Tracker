import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE, numericOptionsConfig } from '../constants';

import { Point } from './point.entity';

@Entity('huts')
export class Hut {
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  pointId!: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  numberOfBeds!: number | null;

  /**
   * eur price
   */
  @Column({
    ...numericOptionsConfig(0, { precision: 12, scale: 2 }),
    nullable: true,
  })
  price!: number | null;

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
