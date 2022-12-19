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
  makePgJsonbArray,
  numericOptionsConfig,
} from '../constants';
import { HikeDifficulty } from '../enums';
import { HikeCondition } from '../enums/hike-condition.enum';
import { HikeWeather } from '../enums/weatherStatus.enum';

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
    type: 'smallint',
    nullable: false,
    default: HikeCondition.open,
  })
  condition!: HikeCondition;

  @Column({
    type: 'smallint',
    nullable: true,
    default: HikeWeather.unknown,
  })
  weatherStatus?: HikeWeather;

  @Column({
    type: 'varchar',
    length: HikeLimits.description,
    nullable: true,
    default: '',
  })
  weatherDescription?: string;

  @Column({
    type: 'varchar',
    length: HikeLimits.cause,
    nullable: true,
    default: '',
  })
  cause?: string;

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

  @Column({
    type: 'citext',
    nullable: false,
    default: '',
  })
  city!: string;

  @Column({
    type: 'citext',
    nullable: false,
    default: '',
  })
  country!: string;

  @Column(makePgJsonbArray(false))
  pictures!: string[];

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
