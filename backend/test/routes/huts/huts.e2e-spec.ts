import { mapToId, Point, UserRole } from '@app/common';
import { finishTest } from '@app/testing';
import { prepareTestApp, prepareVars } from '@test/base';

describe('Huts (e2e)', () => {
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

  it('should filter huts', async () => {
    const { user, localGuide } = await setup();

    const pointData: Partial<Point> = {
      position: { type: 'Point', coordinates: [10, 20] },
    };
    const hut1 = await testService.createHut(
      {
        userId: localGuide.id,
        numberOfBeds: 5,
        price: 55.3,
      },
      {position: { type: 'Point', coordinates: [47, 7] }},
    );
    const hut2 = await testService.createHut(
      {
        userId: localGuide.id,
        numberOfBeds: 2,
        price: 80.5,
      },
      pointData,
    );
    const hut3 = await testService.createHut(
      {
        userId: localGuide.id,
        numberOfBeds: 1,
        price: 100,
      },
      pointData,
    );
    const hut4 = await testService.createHut(
      {
        userId: localGuide.id,
        numberOfBeds: 3,
        price: 45,
      },
      {position: { type: 'Point', coordinates: [47.8, 7] }},
    );
    const hut5 = await testService.createHut(
      {
        userId: localGuide.id,
        numberOfBeds: 6,
        price: 130,
      },
      pointData,
    );

    await restService
      .build(app, user)
      .request()
      .post('/huts/filter')
      .send({ numberOfBedsMin: 10})
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(0);
      });

    await restService
      .build(app, user)
      .request()
      .post('/huts/filter')
      .send({ numberOfBedsMin: 2, numberOfBedsMax: 2 })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(mapToId(body)).toEqual([hut2.id]);
      });
    await restService
      .build(app, user)
      .request()
      .post('/huts/filter')
      .send({
        numberOfBedsMin: 3,
        numberOfBedsMax: 6,
        priceMin: 40,
        priceMax: 100
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);
        expect(mapToId(body)).toEqual([hut4.id, hut1.id]);
      });

      await restService
      .build(app, user)
      .request()
      .post('/huts/filter')
      .send({
        numberOfBedsMin: 3,
        numberOfBedsMax: 6,
        priceMin: 40,
        priceMax: 100, 
        inPointRadius: {
          lat: 7,
          lon: 47,
          radiusKms: 88
        } 
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(mapToId(body)).toEqual([hut1.id]);
      });

      await restService
      .build(app, user)
      .request()
      .post('/huts/filter')
      .send({
        inPointRadius: {
          lat: 7,
          lon: 47,
          radiusKms: 200
        } 
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);
        expect(mapToId(body)).toEqual([hut4.id, hut1.id]);
      });

      await restService
      .build(app, user)
      .request()
      .post('/huts/filter')
      .send({
        inPointRadius: {
          lat: 7,
          lon: 47,
          radiusKms: 7000
        } 
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(5);
        expect(mapToId(body)).toEqual([hut5.id, hut4.id, hut3.id, hut2.id, hut1.id]);
      });

      await restService
      .build(app, user)
      .request()
      .post('/huts/filter')
      .send({
        numberOfBedsMin: 3,
        numberOfBedsMax: 6,
        priceMin: 40,
        priceMax: 100, 
        inPointRadius: {
          lat: 7,
          lon: 47,
          radiusKms: 89
        } 
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);
        expect(mapToId(body)).toEqual([hut4.id, hut1.id]);
      });

    await restService
      .build(app, user)
      .request()
      .post('/huts/filter')
      .send({
        priceMin: 90,
        priceMax: 200,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);
        expect(mapToId(body)).toEqual([hut5.id, hut3.id]);
      });

    await restService
      .build(app, user)
      .request()
      .post('/huts/filter')
      .send({})
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(5);
        expect(mapToId(body)).toEqual([
          hut5.id,
          hut4.id,
          hut3.id,
          hut2.id,
          hut1.id,
        ]);
      });
  });

  it('should return point inside hut', async () => {
    const { user, localGuide } = await setup();

    const hut = await testService.createHut(
      {
        userId: localGuide.id,
        numberOfBeds: 1,
        price: 100,
      },
      {
        position: { type: 'Point', coordinates: [50.33, -30.133] },
      },
    );

    await restService
      .build(app, user)
      .request()
      .get(`/huts/${hut.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: hut.id,
          point: {
            position: { type: 'Point', coordinates: [50.33, -30.133] },
          },
        });
      });
  });
});
