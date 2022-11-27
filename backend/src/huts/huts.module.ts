import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hut, Point } from '@app/common';

import { HutsController } from './huts.controller';
import { HutsService } from './huts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hut, Point])],
  providers: [HutsService],
  controllers: [HutsController],
  exports: [HutsService],
})
export class HutsModule {}
