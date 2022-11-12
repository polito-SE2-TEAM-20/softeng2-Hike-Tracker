import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { SCHEMA } from '../constants';
import { entities } from '../entities';

export const typeormOptions: PostgresConnectionOptions & TypeOrmModuleOptions =
  {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? +process.env.DB_PORT : undefined,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities,
    connectTimeoutMS: 14 * 1000,
    extra: {
      max: 5,
      connectionTimeoutMillis: 30 * 1000,
      idleTimeoutMillis: 20 * 1000,
    },
    schema: SCHEMA,
    logging: !!process.env.SQL_LOGGING ? true : ['error'],
    synchronize: !!process.env.SYNCHRONIZE,
    installExtensions: true,
  };
