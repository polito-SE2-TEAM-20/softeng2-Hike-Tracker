import { DynamicModule, Module } from '@nestjs/common';

import { AppTypeormOptionsCoreModule } from './app-typeorm-options-core.module';
import { AppTypeormOptionsService } from './app-typeorm-options.service';
import { AppTypeormOptions } from './lib.types';

@Module({})
export class AppTypeormOptionsModule {
  static forRoot(options: AppTypeormOptions): DynamicModule {
    return {
      module: AppTypeormOptionsModule,
      imports: [AppTypeormOptionsCoreModule.register(options)],
      providers: [AppTypeormOptionsService],
      exports: [AppTypeormOptionsService],
    };
  }
}
