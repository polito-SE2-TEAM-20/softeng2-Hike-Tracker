import { finishTest } from '@app/testing';
import { prepareTestApp, prepareVars } from '@test/base';
import { Point } from '@app/common';
import { TypeID } from '@app/common';

describe('Parking Lots (e2e)', () => {
  let { dbName, app, restService, moduleRef, testService } = prepareVars();

  beforeEach(async () => {
    ({ dbName, moduleRef, app, testService, restService } =
      await prepareTestApp());
  });

  afterEach(async () => {
    await finishTest({ moduleRef, dbName });
  });

  const setup = async () => {
    const user = await testService.createUser();

    return {
      user,
    };
  };

  it('should create a parking lot', async () => {
    const { user } = await setup();

    // const pointData: Partial<Point> = {
    //     position: { type: 'Point', coordinates: [10, 20] },
    // };

    // await testService.createPoint(pointData)

    const lot1 = 
    {
      "maxCars": 0,
      "location": {
          "lat": 5.056,
          "lon": 4.0586,
          "name": "test",
          "address": "test"
      }
  }

    const lot2 = 
    {
      "maxCars": 2,
      "location": {
          "lat": 5.056,
          "lon": 4.0586,
          "name": "test",
          "address": "test"
      }
  }

      await restService
      .build(app, user)
      .request()
      .post('/parkingLot/insertLot')
      .send(lot1)
      .expect(400)

      await restService
      .build(app, user)
      .request()
      .post('/parkingLot/insertLot')
      .send(lot2)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
            "pointId": 1,
            "maxCars": lot2.maxCars,
            "id": expect.any(TypeID)
        })
      });

  });
});