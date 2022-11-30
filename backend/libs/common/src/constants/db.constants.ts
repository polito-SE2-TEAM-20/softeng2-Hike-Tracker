import { ColumnOptions, RelationOptions } from 'typeorm';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';

import { ColumnNumericTransformer } from '../transformers';

export const APP_TYPEORM_OPTIONS = 'APP_TYPEORM_OPTIONS';
export const SCHEMA = 'public';

export const NUMERIC_OPTIONS: ColumnOptions &
  ColumnNumericOptions &
  ColumnCommonOptions = {
  type: 'numeric',
  precision: 12,
  scale: 2,
  transformer: new ColumnNumericTransformer(),
};

export const numericOptionsConfig = (
  defaultValue: number | null = null,
  options: Pick<ColumnNumericOptions, 'precision' | 'scale'> = {
    precision: 12,
    scale: 2,
  },
): ColumnOptions & ColumnNumericOptions & ColumnCommonOptions => ({
  ...NUMERIC_OPTIONS,
  ...options,
  transformer: new ColumnNumericTransformer(defaultValue),
  default: defaultValue,
});

/**
 * **CASCADE** delete \
 * **CASCADE** update
 */
export const FOREIGN_OPTIONS_CASCADE: RelationOptions = {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  eager: false,
  persistence: false,
};

export const JWT_SECRET: string = process.env.JWT_SECRET
  ? process.env.JWT_SECRET
  : (() => {
      throw new Error('process.env.JWT_SECRET is not defined');
    })();

export const makePgJsonbArray = (
  nullable: boolean,
  defaultValue: () => string = () => "'[]'",
): ColumnOptions => ({
  type: 'jsonb',
  array: false,
  nullable,
  default: defaultValue,
});
