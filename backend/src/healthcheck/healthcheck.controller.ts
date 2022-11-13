import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthcheckController {
  @Get(['/', '/healthcheck'])
  async healthcheck() {
    return { status: 'ok' };
  }
}
