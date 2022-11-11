import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { APP_TYPEORM_OPTIONS } from '../constants';

import { AppTypeormOptions } from './lib.types';

@Injectable()
export class AppTypeormOptionsService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(APP_TYPEORM_OPTIONS) private options: AppTypeormOptions,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.getOptions();
  }

  getOptions() {
    return this.options;
  }
}
