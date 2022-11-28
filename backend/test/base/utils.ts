import { omit } from 'ramda';

import { TypeID } from '@app/common';

export const genArray = (n: number) => Array(n).fill(0);

export const mapArray = <T>(
  n: number,
  generator: (index: number) => Promise<T>,
) => Promise.all(genArray(n).map((_, i) => generator(i)));

export const anyId = () => expect.any(TypeID);

export const withoutLatLon = <T>(value: T): Omit<T, 'lat' | 'lon'> =>
  omit(['lat', 'lon'], value);
