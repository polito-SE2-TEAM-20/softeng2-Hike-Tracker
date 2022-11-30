import { extname, join } from 'path';

import { omit } from 'ramda';

import { mapToId, Point, ROOT, UserRole } from '@app/common';
import { finishTest } from '@app/testing';
import { anyId, prepareTestApp, prepareVars } from '@test/base';

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
      { position: { type: 'Point', coordinates: [47, 7] } },
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
      { position: { type: 'Point', coordinates: [47.8, 7] } },
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
      .send({ numberOfBedsMin: 10 })
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
        priceMax: 100,
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
          radiusKms: 88,
        },
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
          radiusKms: 200,
        },
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
          lat: 20,
          lon: 10,
        },
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(3);
        expect(mapToId(body)).toEqual([hut5.id, hut3.id, hut2.id]);
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
          radiusKms: 89,
        },
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

  it('should throw an error when hut is not found', async () => {
    const { user } = await setup();

    await restService
      .build(app, user)
      .request()
      .get(`/huts/1000`)
      .expect(400)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          message: 'Hut 1000 not found',
        });
      });
  });

  it('should create a new hut', async () => {
    const { localGuide } = await setup();

    const hutData = {
      title: 'test',
      description: 'test',
      location: { lat: 10, lon: 7, address: 'via torino 100' },
      numberOfBeds: 2,
      price: 100,
      elevation: 100,
      ownerName: 'Ricardo',
      website: 'https://own.go/co',
    };

    await restService
      .build(app, localGuide)
      .request()
      .post('/huts/createHut')
      .send(hutData)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: anyId(),
          ...omit(['location'], hutData),
        });
      });
  });

  it('should put hut pictures', async () => {
    const { localGuide } = await setup();

    const hut = await testService.createHut({
      userId: localGuide.id,
      numberOfBeds: 1,
      price: 100,
      pictures: ['test1.png'],
    });

    const testPics = ['img1.png', 'img2.jpeg', 'img3.jpeg'];
    const req = restService
      .build(app, localGuide)
      .request()
      .post(`/hut-pictures/${hut.id}`);

    testPics.forEach((file) =>
      req.attach('pictures', join(ROOT, './test-data', file)),
    );

    await req.expect(200).expect(({ body }) => {
      expect(body).toMatchObject({
        id: hut.id,
      });

      expect(body.pictures).toHaveLength(testPics.length + 1);
      expect(body.pictures[0]).toEqual('test1.png');
      body.pictures.slice(1).forEach((picture, i) => {
        expect(picture).toMatch(
          new RegExp(`^\\/static\\/images\\/.+\\${extname(testPics[i])}$`),
        );
      });
    });
  });

  it('should reorder hut pictures', async () => {
    const { localGuide } = await setup();

    const hut = await testService.createHut({
      userId: localGuide.id,
      numberOfBeds: 1,
      price: 100,
      pictures: ['test1.png', 'test2.jpeg', 'test3.png'],
    });

    const reordered = ['test3.jpeg', 'test1.png', 'test2.png'];
    await restService
      .build(app, localGuide)
      .request()
      .post(`/hut-pictures/${hut.id}/reorder`)
      .send({ pictures: reordered })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: hut.id,
          pictures: reordered,
        });
      });
  });
});
