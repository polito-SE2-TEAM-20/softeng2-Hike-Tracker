import { IsIn, IsString, MaxLength, MinLength, IsEmail, Length, IsOptional } from 'class-validator';

import { UserLimits, UserRole } from '@app/common';

export class RegisterDto {
  @IsString()
  @IsEmail()
  @MinLength(1)
  @MaxLength(UserLimits.email)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(UserLimits.firstName)
  firstName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(UserLimits.firstName)
  lastName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(UserLimits.password)
  password!: string;

  @IsIn(Object.values(UserRole).filter((v) => typeof v === 'number'))
  role!: UserRole;

  @MinLength(10)
  @MaxLength(10)
  @IsOptional()
  phoneNumber!: string;
}

export class LoginDto {
  @IsString()
  @MinLength(1)
  @MaxLength(UserLimits.email)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(UserLimits.password)
  password!: string;
}
