import { Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { complement, isNil, map, prop } from 'ramda';

import { GPoint } from '../types';

export const mapToId = map(prop('id'));

export const isNotNil = complement(isNil) as <T>(
  v: T | null | undefined,
) => v is T;

export const valToNumber = (val: number | string | null | undefined) =>
  typeof val === 'string' ? +val : val;

export function transformToClass<T extends Type>(
  ctor: T,
  value: Record<string, any>,
): InstanceType<T> {
  return plainToInstance(ctor, value);
}

export const latLonToGisPoint = ({
  lat,
  lon,
}: {
  lat?: number | null;
  lon?: number | null;
}): GPoint | null =>
  isNotNil(lat) && isNotNil(lon)
    ? {
        type: 'Point',
        coordinates: [lon, lat],
      }
    : null;

export function escapeIdentifier(str: string) {
  return '"' + str.replace(/"/g, '""') + '"';
}

export function escapeLiteral(str: string): string {
  let hasBackslash = false;
  let escaped = "'";

  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c === "'") {
      escaped += c + c;
    } else if (c === '\\') {
      escaped += c + c;
      hasBackslash = true;
    } else {
      escaped += c;
    }
  }

  escaped += "'";

  if (hasBackslash === true) {
    escaped = ' E' + escaped;
  }

  return escaped;
}
