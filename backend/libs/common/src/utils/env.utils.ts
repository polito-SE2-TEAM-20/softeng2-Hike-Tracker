export const isDev = (): boolean => process.env.NODE_ENV === 'development';

export const isProduction = (): boolean =>
  process.env.NODE_ENV === 'production';

export const isLocal = (): boolean => process.env.NODE_ENV === 'localhost';

export const isTest = (): boolean => process.env.NODE_ENV === 'test';
