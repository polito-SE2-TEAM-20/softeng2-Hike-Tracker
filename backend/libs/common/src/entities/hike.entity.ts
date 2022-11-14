import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  FOREIGN_OPTIONS_CASCADE,
  HikeLimits,
  numericOptionsConfig,
} from '../constants';
import { HikeDifficulty } from '../enums';

import { User } from './user.entity';

@Entity('hikes')
export class Hike {
  @PrimaryGeneratedColumn('increment')
  id!: number;

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
    default: 0,
  })
  expectedTime!: number;

  /**
   * Degrees?
   */
  @Column({
    ...numericOptionsConfig(0),
    nullable: false,
    default: 0,
  })
  ascent!: number;

  /**
   * kilometers?
   */
  @Column({
    ...numericOptionsConfig(0),
    nullable: false,
  })
  distance!: number;

  @Column({
    type: 'smallint',
    nullable: false,
    default: HikeDifficulty.tourist,
  })
  difficulty!: HikeDifficulty;

  @Column({
    type: 'varchar',
    length: HikeLimits.title,
    nullable: false,
    default: '',
  })
  title!: string;

  @Column({
    type: 'varchar',
    length: HikeLimits.description,
    nullable: false,
    default: '',
  })
  description!: string;

  @Column({
    type: 'varchar',
    length: HikeLimits.gpxPath,
    nullable: true,
    default: null,
  })
  gpxPath!: string | null;

  @Column({
    type: 'citext',
    nullable: false,
    default: '',
  })
  region!: string;

  @Column({
    type: 'citext',
    nullable: false,
    default: '',
  })
  province!: string;

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

  gpx?: string | null;
}
