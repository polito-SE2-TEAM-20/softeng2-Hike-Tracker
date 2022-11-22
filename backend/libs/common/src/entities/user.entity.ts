import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserLimits } from '../constants';
import { UserRole } from '../enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'varchar',
    length: UserLimits.email,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: UserLimits.firstName,
    nullable: false,
  })
  firstName!: string;

  @Column({
    type: 'varchar',
    length: UserLimits.lasttName,
    nullable: false,
  })
  lastName!: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  role!: UserRole;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false
  })
  verified!: boolean;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  verificationHash!: string;

  /**
   * For TypeORM metadata only
   * @deprecated
   */
  __joiner?: any;
}
