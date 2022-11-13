import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { E2ETestingModule } from './e2e-testing.module';
import { TestingRestService } from './testing-rest.service';
import { CONNECTION_NAME } from './testing.constants';
import { TestingService } from './testing.service';
import { TestingModuleOptions } from './types';

const providers: Provider[] = [TestingService, TestingRestService];

@Global()
@Module({})
export class E2ETestingCoreModule {
  static register({ connectionOptions }: TestingModuleOptions): DynamicModule {
    return {
      module: E2ETestingModule,
      imports: [
        TypeOrmModule.forRoot({
          name: CONNECTION_NAME,
          ...connectionOptions,
        }),
      ],
      providers: [...providers],
      exports: [...providers],
    };
  }
}
