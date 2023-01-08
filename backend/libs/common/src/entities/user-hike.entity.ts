import { IPostgresInterval } from 'postgres-interval';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE, numericOptionsConfig } from '../constants';

import { Hike } from './hike.entity';
import { User } from './user.entity';

@Entity('user_hikes')
export class UserHike {
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
  hikeId!: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  startedAt!: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  updatedAt?: Date;

  @Column({
    type: 'interval',
    nullable: true, //This should be changed, it's just for testing
  })
  maxElapsedTime?: IPostgresInterval | null;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  finishedAt?: Date | null;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  weatherNotified?: boolean | null;

  @Column({
    type: 'boolean',
    nullable: true,
    default: null,
  })
  unfinishedNotified?: boolean | null;

  // performance stats ahead //
  @Column({
    ...numericOptionsConfig(0),
    nullable: false,
  })
  psTotalKms!: number;

  @Column({
    ...numericOptionsConfig(null),
    nullable: true,
  })
  psHighestAltitude!: number | null;

  @Column({
    ...numericOptionsConfig(null),
    nullable: true,
  })
  psAltitudeRange!: number | null;

  @Column({
    ...numericOptionsConfig(null),
    nullable: true,
  })
  psTotalTimeMinutes!: number | null;

  /**
   * kms/min
   */
  @Column({
    ...numericOptionsConfig(0),
    nullable: false,
  })
  psAverageSpeed!: number;

  /**
   * m/hour
   */
  @Column({
    ...numericOptionsConfig(null),
    nullable: true,
  })
  psAverageVerticalAscentSpeed!: number | null;

  /**
   * TypeORM sql-gen only
   * @deprecated
   */
  @ManyToOne(() => Hike, (entity) => entity.__joiner, FOREIGN_OPTIONS_CASCADE)
  @JoinColumn({
    foreignKeyConstraintName: 'user_hikes_hikeId_fk',
    name: 'hikeId',
    referencedColumnName: 'id',
  })
  hike?: Hike;

  /**
   * TypeORM sql-gen only
   * @deprecated
   */
  @ManyToOne(() => User, (entity) => entity.__joiner, FOREIGN_OPTIONS_CASCADE)
  @JoinColumn({
    foreignKeyConstraintName: 'user_hikes_userId_fk',
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
