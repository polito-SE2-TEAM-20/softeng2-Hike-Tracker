import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { AppTypeormOptionsModule } from './app-typeorm-options.module';
import { createTypeormOptionsProvider } from './app-typeorm-options.provider';
import { AppTypeormOptions } from './lib.types';

@Global()
@Module({})
export class AppTypeormOptionsCoreModule {
  static register(options: AppTypeormOptions): DynamicModule {
    const providers: Provider[] = [createTypeormOptionsProvider(options)];

    return {
      module: AppTypeormOptionsModule,
      providers: [...providers],
      exports: [...providers],
    };
  }
}
