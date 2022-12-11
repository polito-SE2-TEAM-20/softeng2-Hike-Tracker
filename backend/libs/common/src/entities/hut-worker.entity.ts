import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE } from '../constants';

import { Hut } from './hut.entity';
import { User } from './user.entity';

@Entity('hut-worker')
export class HutWorker {
  @PrimaryColumn({
    type: 'integer',
    nullable: false,
  })
  userId!: number;

  @PrimaryColumn({
    type: 'integer',
    nullable: false,
  })
  hutId!: number;

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
   * TypeORM sql-gen only
   * @deprecated
   */
  @ManyToOne(() => Hut, (entity) => entity.__joiner, FOREIGN_OPTIONS_CASCADE)
  @JoinColumn({
    name: 'hutId',
    referencedColumnName: 'id',
  })
  hut?: Hut;
}
