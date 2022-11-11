import { Module } from '@nestjs/common';

import { E2ETestingCoreModule } from './e2e-testing-core.module';
import { TestingModuleOptions } from './types';

@Module({})
export class E2ETestingModule {
  static forRoot({ connectionOptions }: TestingModuleOptions) {
    return {
      module: E2ETestingModule,
      imports: [
        E2ETestingCoreModule.register({
          connectionOptions: {
            ...connectionOptions,
            dropSchema: false,
            synchronize: false,
          },
        }),
      ],
    };
  }
}
