import { Module } from '@nestjs/common';

import { HikesController } from './hikes.controller';

@Module({
  controllers: [HikesController],
})
export class HikesModule {}
