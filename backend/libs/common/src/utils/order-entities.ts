import { find } from 'ramda';

import { ID } from '../types';

export function orderEntities<T>(
  entities: T[],
  ids: ID[],
  finder: (id: ID) => (obj: T) => boolean,
): T[] {
  const orderedEntities: T[] = [];

  ids.forEach((id) => {
    const entity = find(finder(id), entities);

    if (entity) {
      orderedEntities.push(entity);
    }
  });

  return orderedEntities;
}
