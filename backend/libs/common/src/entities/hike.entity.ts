import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE, numericOptionsConfig } from '../constants';
import { HikeDifficulty } from '../enums';

import { User } from './user.entity';

@Entity('hikes')
export class Hike {
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  userId!: number;

  /**
   * Kms (float)
   */
  @Column({
    ...numericOptionsConfig(0),
    nullable: false,
  })
  length!: number;

  /**
   * minutes
   */
  @Column({
    type: 'integer',
    nullable: false,
  })
  expectedTime!: number;

  /**
   * Degrees?
   */
  @Column({
    ...numericOptionsConfig(0),
    nullable: false,
  })
  ascent!: number;

  @Column({
    type: 'smallint',
    nullable: false,
  })
  difficulty!: HikeDifficulty;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
    default: '',
  })
  title!: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: false,
    default: '',
  })
  description!: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  gpxPath!: string | null;

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

  /**
   * For TypeORM metadata only
   * @deprecated
   */
  __joiner?: any;
}
