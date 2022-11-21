import { map, prop } from 'ramda';

export const mapToId = map(prop('id'));

export const valToNumber = (val: number | string | null | undefined) =>
  typeof val === 'string' ? +val : val;
