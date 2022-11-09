import { Test, TestingModule } from '@nestjs/testing';

import { HikesController } from './hikes.controller';

describe('HikesController', () => {
  let controller: HikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HikesController],
    }).compile();

    controller = module.get<HikesController>(HikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
