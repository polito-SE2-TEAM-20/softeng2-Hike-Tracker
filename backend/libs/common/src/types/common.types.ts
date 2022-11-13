import { User } from '../entities';

export type ID = number;

export const TypeID = Number;

export type UserJwtPayload = Omit<User, 'password'> & { password?: string };
