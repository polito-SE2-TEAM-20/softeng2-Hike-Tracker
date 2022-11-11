import { User } from 'libs/common/src/entities/user.entity';

export type UserJwtPayload = Omit<User, 'password'> & { password?: string };
