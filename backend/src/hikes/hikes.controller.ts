import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Hike } from '@app/common';

@Controller('hikes')
export class HikesController {
  constructor(private dataSource: DataSource) {}

  @Get()
  async getHikes(): Promise<Hike[]> {
    return await this.dataSource.getRepository(Hike).findBy({});
  }
}
