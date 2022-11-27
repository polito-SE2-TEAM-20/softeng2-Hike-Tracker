import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { User } from '@app/common';

@Controller()
export class HealthcheckController {
  constructor(private dataSource: DataSource) {}

  @Get(['/', '/healthcheck'])
  async healthcheck() {
    await this.dataSource.getRepository(User).find({ take: 1 });

    return { status: 'ok' };
  }
}
