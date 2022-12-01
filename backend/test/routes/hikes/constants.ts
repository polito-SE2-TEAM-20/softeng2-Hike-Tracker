import { HikeDifficulty } from '@app/common';
import { HikeCondition } from '@app/common/enums/hike-condition.enum';

export const hikeBasic = {
  title: 'eeee',
  description: 'test desc',
  region: 'Torino',
  province: 'TO',
  city: 'Turin',
  country: 'Italy',
  length: 100.56,
  ascent: 5.71,
  expectedTime: 1020,
  difficulty: HikeDifficulty.professionalHiker,
  condition: HikeCondition.open,
};
