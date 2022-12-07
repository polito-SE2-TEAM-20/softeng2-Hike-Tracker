import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE } from '../constants';

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
  updatedAt!: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  finishedAt!: Date | null;

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
