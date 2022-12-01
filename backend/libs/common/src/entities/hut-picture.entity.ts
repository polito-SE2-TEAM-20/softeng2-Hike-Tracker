import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FOREIGN_OPTIONS_CASCADE, HutLimits } from '../constants';

import { Hut } from './hut.entity';

@Entity('hut_picture')
export class HutPicture {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'integer',
  })
  hutId!: number;

  @Column({
    type: 'varchar',
    length: HutLimits.picture,
    nullable: false,
  })
  url!: string;

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
