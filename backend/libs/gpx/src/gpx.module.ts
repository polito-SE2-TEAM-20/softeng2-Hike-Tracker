import { Module } from '@nestjs/common';

import { GpxService } from './gpx.service';

@Module({
  providers: [GpxService],
  exports: [GpxService],
})
export class GpxModule {}
