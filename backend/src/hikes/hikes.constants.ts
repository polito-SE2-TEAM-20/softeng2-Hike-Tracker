import { ObjectLiteral } from 'typeorm';

import { Hike } from '@app/common';

import { FilteredHikesDto } from './hikes.dto';

interface DynamicFilter<E extends ObjectLiteral> {
  entityField: keyof E;
  operator: string;
}

export const hikeFilters: Partial<
  Record<keyof FilteredHikesDto, DynamicFilter<Hike>>
> = {
  city: {
    entityField: 'city',
    operator: '=',
  },
  country: {
    entityField: 'country',
    operator: '=',
  },
  region: {
    entityField: 'region',
    operator: '=',
  },
  province: {
    entityField: 'province',
    operator: '=',
  },
  maxLength: {
    entityField: 'length',
    operator: '<=',
  },
  minLength: {
    entityField: 'length',
    operator: '>=',
  },
  difficultyMax: {
    entityField: 'difficulty',
    operator: '<=',
  },
  difficultyMin: {
    entityField: 'difficulty',
    operator: '>=',
  },
  expectedTimeMax: {
    entityField: 'expectedTime',
    operator: '<=',
  },
  expectedTimeMin: {
    entityField: 'expectedTime',
    operator: '>=',
  },
  ascentMax: {
    entityField: 'ascent',
    operator: '<=',
  },
  ascentMin: {
    entityField: 'ascent',
    operator: '>=',
  },
};
