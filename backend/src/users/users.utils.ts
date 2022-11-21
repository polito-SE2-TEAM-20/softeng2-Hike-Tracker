import { omit } from 'ramda';

import { User } from '@app/common';

export const safeUser = <T extends Partial<User>>(
  user: T,
): Omit<T, 'password'> => omit(['password'], user);
