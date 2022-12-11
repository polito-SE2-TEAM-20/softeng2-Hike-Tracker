import { INestApplication } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { APP_TYPEORM_OPTIONS, entities } from '@app/common';
import {
  E2ETestingModule,
  generateTestDatabase,
  getTestDbOptions,
  TestingRestService,
  TestingService,
} from '@app/testing';

import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';
import { prepareApp } from '../../src/prepare-app';

interface PrepareAppConfig {
  prepareModule?(builder: TestingModuleBuilder): void;
}

export async function prepareTestApp({
  prepareModule,
}: PrepareAppConfig = {}): Promise<{
  dbName: string;
  moduleRef: TestingModule;
  app: INestApplication;
  testService: TestingService;
  restService: TestingRestService;
}> {
  try {
    const dbName = await generateTestDatabase();
    const connectionOptions = await getTestDbOptions(dbName, { entities });

    const testingModule = Test.createTestingModule({
      imports: [
        AppModule,
        E2ETestingModule.forRoot({
          connectionOptions,
        }),
      ],
    })
      .overrideProvider(APP_TYPEORM_OPTIONS)
      .useValue({
        ...connectionOptions,
        retryAttempts: 1,
        keepConnectionAlive: false,
      } as TypeOrmModuleOptions);

    prepareModule?.(testingModule);

    const moduleRef = await testingModule.compile();

    const app = moduleRef.createNestApplication();

    prepareApp(app);

    await app.init();

    const testService = moduleRef.get(TestingService);
    const restService = moduleRef.get(TestingRestService);

    // pass jwtService to testing service
    const jwtService = moduleRef.get(AuthService);
    testService.setJwtService(jwtService);

    return { dbName, moduleRef, app, testService, restService };
  } catch (error) {
    console.error('prepare-test-app', error);

    throw error;
  }
}
