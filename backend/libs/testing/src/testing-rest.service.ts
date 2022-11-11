import { INestApplication, Injectable } from '@nestjs/common';

import { BuilderOpitons, TestingRestRunner } from './rest-runner';
import { UserAuthData } from './types';

@Injectable()
export class TestingRestService {
  build(app: INestApplication | string, user?: UserAuthData) {
    const builderParams: BuilderOpitons = {
      host: typeof app === 'string' ? app : undefined,
      app: typeof app !== 'string' ? app : undefined,
    };

    const builder = new TestingRestRunner(builderParams);

    if (user) {
      builder.auth(user);
    }

    return builder;
  }

  async runApp(app: INestApplication): Promise<{
    host: string;
    port: string;
    runner: TestingRestRunner;
  }> {
    if (!app) {
      throw new Error('App is not defined');
    }

    await app.listen(0);

    const { host, port } = new URL(await app.getUrl());

    const runner = this.build(host);

    return {
      runner,
      host: host.replace('[::1]', 'localhost'),
      port,
    };
  }
}
