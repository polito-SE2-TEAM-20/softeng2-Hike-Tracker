import { ValueProvider } from '@nestjs/common';

import { APP_TYPEORM_OPTIONS } from '../constants';

import { AppTypeormOptions } from './lib.types';

export const createTypeormOptionsProvider = (
  options: AppTypeormOptions,
): ValueProvider<AppTypeormOptions> => ({
  provide: APP_TYPEORM_OPTIONS,
  useValue: options,
});
