import { ColumnOptions, RelationOptions } from 'typeorm';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';

import { ColumnNumericTransformer } from '../transformers';

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
