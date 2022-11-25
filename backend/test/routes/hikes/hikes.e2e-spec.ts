import { randomInt } from 'node:crypto';
import { constants } from 'node:fs';
import path, { resolve } from 'node:path';

import * as fs from 'fs-extra';
import { omit } from 'ramda';

import {
  HikeDifficulty,
  HikePoint,
  latLonToGisPoint,
  mapToId,
  Point,
  PointType,
  ROOT,
  UPLOAD_PATH,
  UserRole,
} from '@app/common';
import { finishTest } from '@app/testing';
import {
  anyId,
  mapArray,
  prepareTestApp,
  prepareVars,
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
        maxCars: (i + 1) * 5,
      }),
    );

    return {
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

  it('should import gpx file, save reference points, start and end points to db', async () => {
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

    const { body: hike } = await restService
      .build(app, localGuide)
      .request()
      .post('/hikes/import')
      .attach('gpxFile', resolve(ROOT, './test-data/4.gpx'))
      .field(withoutCompositeFields(hikeData))
      .field('referencePoints', JSON.stringify(hikeData.referencePoints))
      .field('startPoint', JSON.stringify(hikeData.startPoint))
      .field('endPoint', JSON.stringify(hikeData.endPoint))
      .expect(201);

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

    expect(
      fs.access(
        resolve(UPLOAD_PATH, path.basename(hike.gpxPath)),
        constants.F_OK,
      ),
    ).not.toReject();

    // 3 in total: 2 start/end, 1 ref
    expect(
      await testService.repo(HikePoint).findBy({ hikeId: hike.id }),
    ).toHaveLength(3);
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
      .attach('gpxFile', resolve(ROOT, './test-data/4.gpx'))
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
    const { localGuide, hike, huts } = await setup();

    const [hutStart, hutEnd] = huts;

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
          referencePoints: updateData.referencePoints.map<Point>(
            (refPoint) => ({
              ...withoutLatLon(refPoint),
              id: anyId(),
              position: latLonToGisPoint(refPoint),
              type: PointType.point,
            }),
          ),
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
});
