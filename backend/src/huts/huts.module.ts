import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hut } from '@app/common';

import { HutsController } from './huts.controller';
import { HutsService } from './huts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hut])],
  providers: [HutsService],
  controllers: [HutsController],
  exports: [HutsService],
})
export class HutsModule {}
