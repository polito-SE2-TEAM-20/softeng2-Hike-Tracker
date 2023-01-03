import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE } from '../constants';

import { UserHike } from './user-hike.entity';

@Entity('code-hike')
export class CodeHike {
  @PrimaryColumn({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  code!: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  userHikeId!: number;

  /**
   * TypeORM sql-gen only
   * @deprecated
   */
  @ManyToOne(
    () => UserHike,
    (entity) => entity.__joiner,
    FOREIGN_OPTIONS_CASCADE,
  )
  @JoinColumn({
    name: 'userHikeId',
    referencedColumnName: 'id',
  })
  userHike?: UserHike;
}
