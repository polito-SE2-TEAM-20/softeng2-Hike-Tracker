import { omit } from 'ramda';

import { Point } from '@app/common';

export const testMapPoint = (point: Point) => ({
  ...omit(['createdAt'], point),
  ...point,
});
