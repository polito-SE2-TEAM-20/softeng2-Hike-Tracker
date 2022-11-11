import { Test, TestingModule } from '@nestjs/testing';
import { GpxService } from './gpx.service';

describe('GpxService', () => {
  let service: GpxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GpxService],
    }).compile();

    service = module.get<GpxService>(GpxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
