import { Pool, PoolConfig } from 'pg';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { v4 as uuidv4 } from 'uuid';

import { escapeIdentifier } from '@app/common';

/**
 * Get raw pg config (not typeorm)
 */
const getPgConfig = (database: string): PoolConfig => ({
  user: process.env.TEST_DB_USERNAME,
  host: process.env.TEST_DB_HOST,
  database,
  password: process.env.TEST_DB_PASSWORD,
  port: process.env.TEST_DB_PORT ? +process.env.TEST_DB_PORT : undefined,
});

const createDatabase = async (dbName: string) => {
  const pool = new Pool({
    ...getPgConfig('postgres'),
  });

  await pool.query(`CREATE DATABASE ${escapeIdentifier(dbName)}`);
  await pool.end();

  const poolInDb = new Pool({
    ...getPgConfig(dbName),
  });
  await poolInDb.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);
  await poolInDb.end();
};

export async function getTestDbOptions(
  dbName: string,
  options: Pick<PostgresConnectionOptions, 'entities'> &
    Partial<PostgresConnectionOptions>,
): Promise<PostgresConnectionOptions> {
  return {
    type: 'postgres',
    database: dbName,
    password: process.env.TEST_DB_PASSWORD,
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT ? +process.env.TEST_DB_PORT : undefined,
    username: process.env.TEST_DB_USERNAME,
    synchronize: true,
    dropSchema: true,
    ...options,
  };
}

export function generateTestDbName(): string {
  const dbNameSuffix = uuidv4();
  const dbName = `${process.env.TEST_DB_NAME}_${dbNameSuffix}`;

  return dbName;
}

export async function dropDatabase(dbName: string) {
  const pool = new Pool({
    ...getPgConfig('postgres'),
  });

  await pool.query(`DROP DATABASE IF EXISTS ${escapeIdentifier(dbName)}`);
  await pool.end();
}

/**
 * Generate random db name and create corresponding db
 */
export async function generateTestDatabase() {
  const dbName: string = generateTestDbName();

  await createDatabase(dbName);

  return dbName;
}
