/* eslint-disable unused-imports/no-unused-vars */
import { mapToId, Point, UserRole } from '@app/common';
import { finishTest } from '@app/testing';
import { prepareTestApp, prepareVars } from '@test/base';

describe('HikesModification (e2e)', () => {
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
    const localGuide = await testService.createUser({
      role: UserRole.localGuide,
    });

    return {
      user,
      localGuide,
    };
  };

  it('should return parking lots and huts in a certain radius', async () => {
    const { user, localGuide } = await setup();

    const pointData: Partial<Point> = {
      position: { type: 'Point', coordinates: [10, 20] },
    };

    const hut1 = await testService.createHut(
      {
        userId: user.id,
        numberOfBeds: 5,
        price: 55.3,
      },
      { position: { type: 'Point', coordinates: [47, 7] } },
    );

    const hut2 = await testService.createHut(
      {
        userId: user.id,
        numberOfBeds: 2,
        price: 80.5,
      },
      pointData,
    );

    const hut3 = await testService.createHut(
      {
        userId: user.id,
        numberOfBeds: 1,
        price: 100,
      },
      pointData,
    );

    const hut4 = await testService.createHut(
      {
        userId: user.id,
        numberOfBeds: 3,
        price: 45,
      },
      { position: { type: 'Point', coordinates: [47.8, 7] } },
    );

    const hut5 = await testService.createHut(
      {
        userId: user.id,
        numberOfBeds: 6,
        price: 130,
      },
      pointData,
    );

    const parkingLot1 = await testService.createParkingLot(
      {
        maxCars: 150,
        userId: user.id,
      },
      { position: { type: 'Point', coordinates: [47.8, 7] } },
    );

    const parkingLot2 = await testService.createParkingLot(
      {
        maxCars: 200,
        userId: user.id,
      },
      { position: { type: 'Point', coordinates: [47.5, 7] } },
    );

    const parkingLot3 = await testService.createParkingLot(
      {
        maxCars: 85,
        userId: user.id,
      },
      { position: { type: 'Point', coordinates: [48.8, 7] } },
    );

    const parkingLot4 = await testService.createParkingLot(
      {
        userId: user.id,
        maxCars: 70,
      },
      pointData,
    );

    const parkingLot5 = await testService.createParkingLot(
      {
        userId: user.id,
        maxCars: 300,
      },
      pointData,
    );

    await restService
      .build(app, user)
      .request()
      .post('/hike-modification/hutsAndParkingLots')
      .send({ lat: 7.0, lon: 47.0, radiusKms: 100 })
      .expect(200)
      .expect(({ body }) => {
        expect(body.huts).toHaveLength(2);
        expect(body.parkingLots).toHaveLength(2);
        expect(mapToId(body.huts)).toEqual([hut4.id, hut1.id]);
        expect(mapToId(body.parkingLots)).toEqual([
          parkingLot2.id,
          parkingLot1.id,
        ]);
      });

    await restService
      .build(app, user)
      .request()
      .post('/hike-modification/hutsAndParkingLots')
      .send({ lat: 7.0, lon: 47.0, radiusKms: 800 })
      .expect(200)
      .expect(({ body }) => {
        expect(body.huts).toHaveLength(2);
        expect(body.parkingLots).toHaveLength(3);
        expect(mapToId(body.huts)).toEqual([hut4.id, hut1.id]);
        expect(mapToId(body.parkingLots)).toEqual([
          parkingLot3.id,
          parkingLot2.id,
          parkingLot1.id,
        ]);
      });
  });
});
