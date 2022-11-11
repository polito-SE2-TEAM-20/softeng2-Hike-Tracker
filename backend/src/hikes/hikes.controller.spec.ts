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

  it('Should return 1 hike in Salerno', async () => {
    const body = {
      "province": "Salerno",
      "region": null,
      "maxLength": 15,
      "minLength": 5,
      "expectedTimeMin": null,
      "expectedTimeMax": null,
      "difficultyMin": null,
      "difficultyMax": null,
      "ascentMin": null,
      "ascentMax": null
    };
    const result = [{
      "id": 4,
      "userId": 0,
      "length": 8.7,
      "expectedTime": 200,
      "ascent": 1200,
      "difficulty": 0,
      "title": "Te lo sfonni poco",
      "description": "Hike poco impegnativo",
      "gpxPath": null,
      "region": "Campania",
      "province": "Salerno"
    }];

    expect(controller.getFilteredHikes(body)).toBe(result);
  });
});
