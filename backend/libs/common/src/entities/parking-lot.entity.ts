import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE } from '../constants';

import { Point } from './point.entity';

@Entity('parking_lots')
export class ParkingLot {
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
  maxCars!: number | null;

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
