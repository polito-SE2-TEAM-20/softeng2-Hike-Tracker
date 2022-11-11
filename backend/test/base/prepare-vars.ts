import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

import { TestingRestService, TestingService } from '@app/testing';

const empty = () => null as any;

export function prepareVars(): {
  dbName: string;
  moduleRef: TestingModule;
  app: INestApplication;
  testService: TestingService;
  restService: TestingRestService;
} {
  return {
    app: empty(),
    dbName: empty(),
    restService: empty(),
    moduleRef: empty(),
    testService: empty(),
  };
}
