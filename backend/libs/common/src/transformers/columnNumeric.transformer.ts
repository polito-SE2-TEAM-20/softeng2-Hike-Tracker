import { ValueTransformer } from 'typeorm';

const isNullOrUndefined = (obj: unknown): obj is null | undefined => {
  return typeof obj === 'undefined' || obj === null;
};

export class ColumnNumericTransformer implements ValueTransformer {
  constructor(private defaultValue: number | null = null) {}

  to(data?: number | null): number | null {
    if (!isNullOrUndefined(data)) {
      return data;
    }

    return this.defaultValue;
  }

  from(data?: string | null): number | null {
    if (!isNullOrUndefined(data)) {
      const res = parseFloat(data);

      return isNaN(res) ? null : res;
    }

    return this.defaultValue;
  }
}
