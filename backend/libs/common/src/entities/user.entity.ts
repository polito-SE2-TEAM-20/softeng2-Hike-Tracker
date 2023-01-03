import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PreferencesDto } from '@core/users/preferences.dto';

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
    type: 'varchar',
    length: UserLimits.phoneNumber,
    nullable: true,
    default: null,
  })
  phoneNumber!: string | null;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  verified!: boolean;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
    default: null,
  })
  verificationHash!: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  approved!: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: null,
  })
  preferences!: PreferencesDto;

  @Column({
    type: 'integer',
    array: true,
    nullable: true,
    default: null,
  })
  plannedHikes!: number[];

  /**
   * For TypeORM metadata only
   * @deprecated
   */
  __joiner?: any;
}
