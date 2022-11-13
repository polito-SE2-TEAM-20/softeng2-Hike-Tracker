import { User } from '../entities';

export type ID = number;

export const TypeID = Number;

export type UserJwtPayload = { id: ID };
export type UserContext = Omit<User, 'password'>;
