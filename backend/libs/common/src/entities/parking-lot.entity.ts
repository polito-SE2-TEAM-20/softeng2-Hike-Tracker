import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE } from '../constants';

import { Point } from './point.entity';
import { User } from './user.entity';

@Entity('parking_lots')
export class ParkingLot {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  userId!: number;

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

  @Column({
    type: 'varchar',
    nullable: true,
  })
  country!: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  region!: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  province!: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  city!: string | null;

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

  /**
   * TypeORM sql-gen only
   * @deprecated
   */
  @ManyToOne(() => User, (entity) => entity.__joiner, FOREIGN_OPTIONS_CASCADE)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user?: User;
}
