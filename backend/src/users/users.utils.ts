import { omit } from 'ramda';

import { User } from '@app/common';

export const safeUser = (user: User) => omit(['password'], user);
