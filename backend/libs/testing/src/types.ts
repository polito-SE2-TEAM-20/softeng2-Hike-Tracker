import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { User } from '@app/common';

export interface TestingModuleOptions {
  connectionOptions: PostgresConnectionOptions;
}

export interface CreateWrapperOptions {
  app: INestApplication;
  supertest?: typeof request;
  user?: User | string;
}

export type UserAuthData = { token?: string };

export type MockType<T> = {
  [P in keyof T]: jest.Mock<Record<string, unknown>>;
};

export type MockTypePartial<T> = {
  [P in keyof T]?: jest.Mock<Record<string, unknown>>;
};

export type GenericFunction = (...args: any[]) => any;

export type PickByTypeKeyFilter<T, C> = {
  [K in keyof T]: T[K] extends C ? K : never;
};

export type KeysByType<T, C> = PickByTypeKeyFilter<T, C>[keyof T];

export type ValuesByType<T, C> = {
  [K in keyof T]: T[K] extends C ? T[K] : never;
};

export type PickByType<T, C> = Pick<ValuesByType<T, C>, KeysByType<T, C>>;

export type MethodsOf<T> = KeysByType<Required<T>, GenericFunction>;

export type InterfaceOf<T> = PickByType<T, GenericFunction>;

export type MockedInterface<T> = {
  [K in MethodsOf<T>]: jest.Mock<
    ReturnType<InterfaceOf<T>[K]>,
    Parameters<InterfaceOf<T>[K]>
  >;
};

export type PartiallyMockedInterface<T> = {
  [K in MethodsOf<T>]?: jest.Mock<
    ReturnType<InterfaceOf<T>[K]>,
    Parameters<InterfaceOf<T>[K]>
  >;
};
