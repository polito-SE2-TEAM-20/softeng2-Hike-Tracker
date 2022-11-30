import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  FOREIGN_OPTIONS_CASCADE,
  HutLimits,
  makePgJsonbArray,
  numericOptionsConfig,
} from '../constants';

import { Point } from './point.entity';
import { User } from './user.entity';

@Entity('huts')
export class Hut {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  userId!: number;

  @Column({
    type: 'varchar',
    length: HutLimits.title,
    nullable: false,
    default: '',
  })
  title!: string;

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

  @Column({
    type: 'varchar',
    length: HutLimits.ownerName,
    nullable: true,
  })
  ownerName!: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  website!: string;

  @Column({
    ...numericOptionsConfig(null),
    nullable: true,
  })
  elevation!: number | null;

  @Column(makePgJsonbArray(false))
  pictures!: string[];

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
