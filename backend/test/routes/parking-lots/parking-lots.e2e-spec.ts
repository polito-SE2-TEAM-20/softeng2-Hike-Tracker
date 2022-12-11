import { TypeID } from '@app/common';
import { finishTest } from '@app/testing';
import { prepareTestApp, prepareVars } from '@test/base';

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

    const lot1 = {
      maxCars: 0,
      location: {
        lon: 4.0586,
        lat: 5.056,
        name: 'test',
        address: 'test',
      },
    };

    const lot2 = {
      maxCars: 2,
      country: 'Italy',
      region: 'Piemonte',
      province: 'Torino',
      city: 'Torino',
      location: {
        lon: 4.0587,
        lat: 5.0556,
        name: 'test',
        address: 'test',
      },
    };

    await restService
      .build(app, user)
      .request()
      .post('/parkingLot/insertLot')
      .send(lot1)
      .expect(400);

    await restService
      .build(app, user)
      .request()
      .post('/parkingLot/insertLot')
      .send(lot2)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          pointId: 1,
          userId: user.id,
          maxCars: lot2.maxCars,
          country: lot2.country,
          region: lot2.region,
          province: lot2.province,
          city: lot2.city,
          location: {
            lon: lot2.location.lon,
            lat: lot2.location.lat,
            name: lot2.location.name,
            address: lot2.location.address,
          },
          id: expect.any(TypeID),
        });
      });
  });

  it('should retrieve parking lots created by an user', async () => {
    const { user } = await setup();

    const lot = {
      maxCars: 2,
      country: 'Italy',
      region: 'Piemonte',
      province: 'Torino',
      city: 'Torino',
      location: {
        lon: 4.0587,
        lat: 5.0556,
        name: 'test',
        address: 'test',
      },
    };

    await restService
      .build(app, user)
      .request()
      .post('/parkingLot/insertLot')
      .send(lot)
      .expect(201);

    await restService
      .build(app, user)
      .request()
      .get('/parkingLot/lots')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject([
          {
            pointId: 1,
            userId: user.id,
            maxCars: lot.maxCars,
            country: lot.country,
            region: lot.region,
            province: lot.province,
            city: lot.city,
            point: {
              id: 1,
              type: 2,
              position: {
                type: 'Point',
                coordinates: [lot.location.lon, lot.location.lat],
              },
              address: lot.location.address,
              name: lot.location.name,
            },
            id: expect.any(TypeID),
          },
        ]);
      });
  });

  it('should retrieve all parking lots in db', async () => {
    const user1 = await testService.createUser();
    const user2 = await testService.createUser();

    const lot1 = {
      maxCars: 2,
      country: 'Italy',
      region: 'Piemonte',
      province: 'Torino',
      city: 'Torino',
      location: {
        lon: 4.0587,
        lat: 5.0556,
        name: 'test',
        address: 'test',
      },
    };

    const lot2 = {
      maxCars: 2,
      country: 'Italy',
      region: 'Piemonte',
      province: 'Torino',
      city: 'Torino',
      location: {
        lon: 4.0587,
        lat: 5.0556,
        name: 'test2',
        address: 'test2',
      },
    };

    await restService
      .build(app, user1)
      .request()
      .post('/parkingLot/insertLot')
      .send(lot1)
      .expect(201);

    await restService
      .build(app, user2)
      .request()
      .post('/parkingLot/insertLot')
      .send(lot2)
      .expect(201);

    await restService
      .build(app, user1)
      .request()
      .get('/parkingLot/all_lots')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject([
          {
            pointId: expect.any(TypeID),
            userId: user1.id,
            maxCars: lot1.maxCars,
            country: lot1.country,
            region: lot1.region,
            province: lot1.province,
            city: lot1.city,
            point: {
              id: expect.any(TypeID),
              type: 2,
              position: {
                type: 'Point',
                coordinates: [lot1.location.lon, lot1.location.lat],
              },
              address: lot1.location.address,
              name: lot1.location.name,
            },
            id: expect.any(TypeID),
          },
          {
            pointId: expect.any(TypeID),
            userId: user2.id,
            maxCars: lot2.maxCars,
            country: lot2.country,
            region: lot2.region,
            province: lot2.province,
            city: lot2.city,
            point: {
              id: expect.any(TypeID),
              type: 2,
              position: {
                type: 'Point',
                coordinates: [lot2.location.lon, lot2.location.lat],
              },
              address: lot2.location.address,
              name: lot2.location.name,
            },
            id: expect.any(TypeID),
          },
        ]);
      });
  });
});
