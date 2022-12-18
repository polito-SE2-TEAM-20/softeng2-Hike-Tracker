import { randomInt } from 'node:crypto';
import { constants } from 'node:fs';
import path from 'node:path';

import * as fs from 'fs-extra';
import { omit } from 'ramda';

import {
  HikeDifficulty,
  HikePoint,
  HutWorker,
  IMAGES_UPLOAD_PATH,
  latLonToGisPoint,
  mapToId,
  PointType,
  ROOT,
  UPLOAD_PATH,
  UserRole,
} from '@app/common';
import { HikeCondition } from '@app/common/enums/hike-condition.enum';
import { finishTest } from '@app/testing';
import {
  anyId,
  mapArray,
  prepareTestApp,
  prepareVars,
  validatePictures,
  withoutLatLon,
} from '@test/base';

import { hikeBasic } from './constants';

const withoutCompositeFields = omit([
  'referencePoints',
  'startPoint',
  'endPoint',
]);

const referencePointTransformer = (refPoint: any) => ({
  ...withoutLatLon(refPoint),
  id: anyId(),
  position: latLonToGisPoint(refPoint),
  type: PointType.point,
});

describe('Hikes (e2e)', () => {
  let { dbName, app, restService, moduleRef, testService } = prepareVars();

  beforeEach(async () => {
    ({ dbName, moduleRef, app, testService, restService } =
      await prepareTestApp());
  });

  afterEach(async () => {
    await finishTest({ moduleRef, dbName });
  });

  const setup = async () => {
    const localGuide = await testService.createUser({
      role: UserRole.localGuide,
    });

    const hutWorker = await testService.createUser({
      role: UserRole.hutWorker,
    });

    const hike = await testService.createHike({ userId: localGuide.id });
    const huts = await mapArray(10, (i) =>
      testService.createHut({
        userId: localGuide.id,
        numberOfBeds: i,
        price: randomInt(10, 100),
        title: `Hut ${i}`,
      }),
    );
    const parkingLots = await mapArray(10, (i) =>
      testService.createParkingLot({
        userId: localGuide.id,
        maxCars: (i + 1) * 5,
      }),
    );

    return {
      hutWorker,
      localGuide,
      hike,
      huts,
      parkingLots,
    };
  };

  it('should filter hikes', async () => {
    const { localGuide } = await setup();

    const hikes = await Promise.all(
      Array(5)
        .fill(0)
        .map(async (_, i) =>
          testService.createHike({
            title: `Hike ${i}`,
            description: 'test desc',
            region: 'Torino',
            province: 'TO',
            city: i < 3 ? 'Turin' : 'Milan',
            country: 'Italy',
            length: 100.56,
            ascent: 5.71,
            expectedTime: 100 * (i + 1),
            difficulty: HikeDifficulty.tourist,
            userId: localGuide.id,
            condition: HikeCondition.open,
          }),
        ),
    );

    await restService
      .build(app, localGuide)
      .request()
      .post('/hikes/filteredHikes')
      .send({
        city: 'Turin',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(3);
        expect(mapToId(body)).toIncludeSameMembers(mapToId(hikes.slice(0, 3)));
      });

    await restService
      .build(app, localGuide)
      .request()
      .post('/hikes/filteredHikes')
      .send({
        expectedTimeMin: 400,
        expectedTimeMax: 500,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);
        expect(mapToId(body)).toIncludeSameMembers(mapToId(hikes.slice(3, 5)));
      });
  });

  it('should import gpx file, pictures, save reference points, start and end points to db', async () => {
    const { localGuide } = await setup();

    const hikeData = {
      ...hikeBasic,
      referencePoints: [
        {
          name: 'Small fountain',
          address: 'Some test address 1/1',
          lat: 45.18,
          lon: 7.084,
        },
      ],
      startPoint: {
        name: 'That small building near garage entrance',
      },
      endPoint: {
        address: 'Turin, Via Torino 130',
        lat: 45.181,
        lon: 7.083,
      },
    };
    const pictures = ['img2.jpeg'];

    const req = restService
      .build(app, localGuide)
      .request()
      .post('/hikes/import')
      .attach('gpxFile', path.resolve(ROOT, './test-data/4.gpx'))
      .field(withoutCompositeFields(hikeData))
      .field('referencePoints', JSON.stringify(hikeData.referencePoints))
      .field('startPoint', JSON.stringify(hikeData.startPoint))
      .field('endPoint', JSON.stringify(hikeData.endPoint));

    pictures.forEach((file) =>
      req.attach('pictures', path.join(ROOT, './test-data', file)),
    );

    const { body: hike } = await req.expect(201);

    expect(hike).toMatchObject({
      id: anyId(),
      ...hikeData,
      referencePoints: hikeData.referencePoints.map(referencePointTransformer),
      startPoint: {
        type: 'point',
        point: {
          ...withoutLatLon(hikeData.startPoint),
          id: anyId(),
          address: null,
          position: null,
        },
      },
      endPoint: {
        type: 'point',
        point: {
          ...withoutLatLon(hikeData.endPoint),
          id: anyId(),
          name: null,
        },
      },
    });
    expect(hike.gpxPath).toMatch(/^\/static\/gpx\/.+\.gpx$/);
    expect(hike.pictures).toHaveLength(pictures.length);
    validatePictures(hike.pictures, pictures);

    expect(
      fs.access(
        path.resolve(UPLOAD_PATH, path.basename(hike.gpxPath)),
        constants.F_OK,
      ),
    ).not.toReject();

    // 3 in total: 2 start/end, 1 ref
    expect(
      await testService.repo(HikePoint).findBy({ hikeId: hike.id }),
    ).toHaveLength(3);
  });

  it('should return an error when gpx is empty', async () => {
    const { localGuide } = await setup();

    const hikeData = hikeBasic;

    await restService
      .build(app, localGuide)
      .request()
      .post('/hikes/import')
      .attach('gpxFile', path.resolve(ROOT, './test-data/empty.gpx'))
      .field(withoutCompositeFields(hikeData))
      .field('referencePoints', JSON.stringify([]))
      .field('startPoint', JSON.stringify([]))
      .field('endPoint', JSON.stringify([]))
      .expect(400)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          message: 'Unable to find hikes in gpx file',
        });
      });
  });

  it('shoule retrieve hike by id', async () => {
    const { localGuide } = await setup();

    const hike = await testService.createHike({
      ...hikeBasic,
      userId: localGuide.id,
    });

    await restService
      .build(app, localGuide)
      .request()
      .get(`/hikes/${hike.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: hike.id,
          ...hikeBasic,
          referencePoints: [],
          startPoint: null,
          endPoint: null,
        });
      });
  });

  it('should link hut as a start/end point', async () => {
    const { localGuide, huts, hike: otherHike } = await setup();

    // add some random data for other hike
    await testService.repo(HikePoint).save(
      [huts[7], huts[4]].map<HikePoint>((hut, index) => ({
        hikeId: otherHike.id,
        index,
        type: index & 1 ? PointType.endPoint : PointType.startPoint,
        pointId: hut.pointId,
      })),
    );

    const hutStart = huts[2];
    const hutEnd = huts[5];
    const hikeData = {
      ...hikeBasic,
      referencePoints: [
        {
          name: 'Small fountain',
          address: 'Some test address 1/1',
          lat: 45.18,
          lon: 7.084,
        },
      ],
      startPoint: {
        hutId: hutStart.id,
      },
      endPoint: {
        hutId: hutEnd.id,
      },
    };

    const { body: hike } = await restService
      .build(app, localGuide)
      .request()
      .post('/hikes/import')
      .attach('gpxFile', path.resolve(ROOT, './test-data/4.gpx'))
      .field(withoutCompositeFields(hikeData))
      .field('referencePoints', JSON.stringify(hikeData.referencePoints))
      .field('startPoint', JSON.stringify(hikeData.startPoint))
      .field('endPoint', JSON.stringify(hikeData.endPoint))
      .expect(201);

    expect(hike).toMatchObject({
      id: anyId(),
      startPoint: {
        type: 'hut',
        entity: {
          ...hutStart,
          point: hutStart.point,
        },
      },
      endPoint: {
        type: 'hut',
        entity: {
          ...hutEnd,
          point: hutEnd.point,
        },
      },
    });
  });

  it('should update hike - referencePoints, startPoint, endPoint', async () => {
    const { localGuide, hike, huts, parkingLots } = await setup();

    const hutStart = huts[9];
    const parkingLotEnd = parkingLots[3];

    const updateData = {
      title: 'eeee',
      description: 'test desc',
      region: 'Torino',
      province: 'TO',
      city: 'Milan',
      country: 'Italy',
      length: 100.56,
      ascent: 5.71,
      expectedTime: 1020,
      difficulty: HikeDifficulty.professionalHiker,
      condition: HikeCondition.open,
      referencePoints: [
        {
          name: 'Small fountain',
          address: 'Some test address 1/1',
          lat: 45.18,
          lon: 7.084,
        },
      ],
      startPoint: {
        hutId: hutStart.id,
      },
      endPoint: {
        parkingLotId: parkingLotEnd.id,
      },
    };

    await restService
      .build(app, localGuide)
      .request()
      .put(`/hikes/${hike.id}`)
      .send(updateData)
      .expect(({ body }) => {
        expect(body).not.toEqual(null);
        expect(body).toMatchObject({
          ...hike,
          ...withoutCompositeFields(updateData),
          referencePoints: updateData.referencePoints.map(
            referencePointTransformer,
          ),
          startPoint: {
            type: 'hut',
            entity: {
              ...hutStart,
              point: hutStart.point,
            },
          },
          endPoint: {
            type: 'parkingLot',
            entity: {
              ...parkingLotEnd,
              point: parkingLotEnd.point,
            },
          },
        });
      });
  });

  it('should link huts to a hike', async () => {
    const { localGuide, hike, huts, parkingLots } = await setup();

    const linkedHuts = huts.slice(0, 3);
    const linkedLots = parkingLots.slice(0, 3);
    await restService
      .build(app, localGuide)
      .request()
      .post('/hikes/linkPoints')
      .send({
        hikeId: hike.id,
        linkedPoints: [
          ...linkedHuts.map(({ id: hutId }) => ({ hutId })),
          ...linkedLots.map(({ id: parkingLotId }) => ({ parkingLotId })),
        ],
      })

      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: hike.id,
        });
        expect(body.linkedPoints).toIncludeSameMembers([
          ...linkedLots.map((entity) =>
            expect.objectContaining({
              type: 'parkingLot',
              entity: expect.objectContaining({
                ...entity,
                point: expect.objectContaining({ id: anyId() }),
              }),
            }),
          ),
          ...linkedHuts.map((entity) =>
            expect.objectContaining({
              type: 'hut',
              entity: expect.objectContaining({
                ...entity,
                point: expect.objectContaining({ id: anyId() }),
              }),
            }),
          ),
        ]);
      });
  });

  it('should delete the specified hike and all its relative points', async () => {
    const { localGuide } = await setup();

    const hikeData = {
      title: 'eeee',
      description: 'test desc',
      region: 'Torino',
      province: 'TO',
      length: 100.56,
      ascent: 5.71,
      expectedTime: 1020,
      difficulty: HikeDifficulty.professionalHiker,
      condition: HikeCondition.open,
      city: 'Torino',
      country: 'Italy',
      referencePoints: [
        {
          name: 'Small fountain',
          address: 'Some test address 1/1',
          lat: 45.18,
          lon: 7.084,
        },
      ],
      startPoint: {
        name: 'That small building near garage entrance',
      },
      endPoint: {
        address: 'Turin, Via Torino 130',
        lat: 45.181,
        lon: 7.083,
      },
    };

    const hikeData2 = {
      title: 'eeee',
      description: 'test desc',
      region: 'Torino',
      province: 'TO',
      length: 100.56,
      ascent: 5.71,
      expectedTime: 1020,
      difficulty: HikeDifficulty.professionalHiker,
      condition: HikeCondition.open,
      city: 'Torino',
      country: 'Italy',
      referencePoints: [
        {
          name: 'Small fountain',
          address: 'Some test address 1/1',
          lat: 45.12,
          lon: 7.084,
        },
      ],
      startPoint: {
        name: 'That small building near garage entrance 2',
      },
      endPoint: {
        address: 'Turin, Via Torino 130',
        lat: 45.151,
        lon: 7.083,
      },
    };

    await restService
      .build(app, localGuide)
      .request()
      .post('/hikes/import')
      .attach('gpxFile', path.resolve(ROOT, './test-data/4.gpx'))
      .field(withoutCompositeFields(hikeData))
      .field('referencePoints', JSON.stringify(hikeData.referencePoints))
      .field('startPoint', JSON.stringify(hikeData.startPoint))
      .field('endPoint', JSON.stringify(hikeData.endPoint))
      .expect(201);

    const { body: hike } = await restService
      .build(app, localGuide)
      .request()
      .post('/hikes/import')
      .attach('gpxFile', path.resolve(ROOT, './test-data/1.gpx'))
      .field(withoutCompositeFields(hikeData2))
      .field('referencePoints', JSON.stringify(hikeData2.referencePoints))
      .field('startPoint', JSON.stringify(hikeData2.startPoint))
      .field('endPoint', JSON.stringify(hikeData2.endPoint))
      .expect(201);

    // const points = (
    //   await testService.repo(HikePoint).findBy({ hikeId: hike.id })
    // ).map((point) => point.pointId);

    await restService
      .build(app, localGuide)
      .request()
      .delete(`/hikes/${hike.id}`)
      .expect(({ body }) => {
        expect(body.rowsAffected).toBe(1);
      })
      .expect(200);

    expect(
      await testService.repo(HikePoint).findBy({ hikeId: hike.id }),
    ).toBeEmpty();

    await restService
      .build(app, localGuide)
      .request()
      .delete(`/hikes/10`)
      .expect(({ body }) => {
        expect(body.message).toBe('This local guide can not delete this hike.');
      })
      .expect(400);
  });

  it('should update "Hike Condition" and "Cause", if the Hut Worker works in a hut along the trail', async () => {
    const { hutWorker, hike, huts, localGuide } = await setup();

    const updateCondition = {
      condition: HikeCondition.closed,
      cause: 'Christmas Holidays!',
    };

    const linkedHuts = huts.slice(0, 3);

    await restService
      .build(app, hutWorker)
      .request()
      .put(`/hikes/condition/${hike.id}`)
      .send(updateCondition)
      .expect(({ body }) => {
        expect(body.statusCode).toBe(400);
        expect(body.message).toBe(
          'You are not authorized to change this condition since there are not Huts of your property.',
        );
      });

    //First create a hike with linked huts
    await restService
      .build(app, localGuide)
      .request()
      .post('/hikes/linkPoints')
      .send({
        hikeId: hike.id,
        linkedPoints: [...linkedHuts.map(({ id: hutId }) => ({ hutId }))],
      });

    await restService
      .build(app, hutWorker)
      .request()
      .put(`/hikes/condition/${hike.id}`)
      .send(updateCondition)
      .expect(({ body }) => {
        expect(body.statusCode).toBe(400);
        expect(body.message).toBe(
          'You are not authorized to change this condition since there are not Huts in which you work on this trail.',
        );
      });

    //I'm connecting a created hut Worker to a specific hut
    await testService.getRepository(HutWorker).save({
      hutId: linkedHuts[2].id,
      userId: hutWorker.id,
    });

    await restService
      .build(app, hutWorker)
      .request()
      .put(`/hikes/condition/${hike.id}`)
      .send(updateCondition)
      .expect(({ body }) => {
        expect(body.condition).toBe(HikeCondition.closed);
        expect(body.cause).toBe('Christmas Holidays!');
      });
  });

  it('should upload hike pictures', async () => {
    const { localGuide } = await setup();

    const hike = await testService.createHike({
      ...hikeBasic,
      userId: localGuide.id,
      pictures: ['test1.png'],
    });

    const testPics = ['img2.jpeg', 'img3.jpeg', 'img1.png'];
    const req = restService
      .build(app, localGuide)
      .request()
      .post(`/hike-pictures/${hike.id}`);

    testPics.forEach((file) =>
      req.attach('pictures', path.join(ROOT, './test-data', file)),
    );

    await req.expect(200).expect(({ body }) => {
      expect(body).toMatchObject({
        id: hike.id,
        pictures: expect.any(Array),
      });

      expect(body.pictures).toHaveLength(testPics.length + 1);
      expect(body.pictures[0]).toEqual('test1.png');
      validatePictures(body.pictures.slice(1), testPics);
    });
  });

  it('should reorder hike pictures', async () => {
    const { localGuide } = await setup();

    const hike = await testService.createHike({
      ...hikeBasic,
      userId: localGuide.id,
      pictures: ['test1.png', 'test2.jpeg', 'test3.png'],
    });

    const reorderedPictures = ['test3.jpeg', 'test1.png', 'test2.png'];

    await restService
      .build(app, localGuide)
      .request()
      .put(`/hikes/${hike.id}`)
      .send({ pictures: reorderedPictures })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: hike.id,
          pictures: reorderedPictures,
        });
      });
  });

  it('should delete removed hike pictures from disk', async () => {
    const { localGuide, hike } = await setup();

    const testPics = ['img2.jpeg', 'img1.png'];
    const req = restService
      .build(app, localGuide)
      .request()
      .post(`/hike-pictures/${hike.id}`);

    testPics.forEach((file) =>
      req.attach('pictures', path.join(ROOT, './test-data', file)),
    );

    const { body: updatedHike } = await req.expect(200);
    const firstImage = path.basename(updatedHike.pictures[0]);

    await restService
      .build(app, localGuide)
      .request()
      .put(`/hikes/${updatedHike.id}`)
      .send({ pictures: updatedHike.pictures.slice(1) })
      .expect(200)
      .expect(({ body }) => {
        expect(body.pictures).toHaveLength(1);
        expect(body.pictures[0]).toEqual(updatedHike.pictures[1]);
      });

    expect(
      fs.access(
        path.resolve(IMAGES_UPLOAD_PATH, path.basename(firstImage)),
        constants.F_OK,
      ),
    ).toReject();
    expect(
      fs.access(
        path.resolve(
          IMAGES_UPLOAD_PATH,
          path.basename(updatedHike.pictures[1]),
        ),
        constants.F_OK,
      ),
    ).not.toReject();
  });
});
