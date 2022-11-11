import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

import { dropDatabase } from '../testing.utils';

interface Params {
  app?: INestApplication;
  moduleRef: TestingModule;
  dbName: string;
}

export async function finishTest({ dbName, moduleRef }: Params) {
  try {
    await moduleRef.close();
  } catch (error) {
    console.error('Error on moduleRef.close()', error);
  } finally {
    try {
      await dropDatabase(dbName);
    } catch (error) {
      console.error('Error on dropDatabase', error);
    }
  }
}
