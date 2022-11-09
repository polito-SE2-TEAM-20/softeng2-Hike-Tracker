import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole } from '../enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  firstName!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName!: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  role!: UserRole;

  /**
   * For TypeORM metadata only
   * @deprecated
   */
  __joiner?: any;
}
