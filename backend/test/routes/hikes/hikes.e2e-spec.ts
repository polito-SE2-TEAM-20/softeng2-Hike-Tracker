import { randomInt } from 'node:crypto';
import { constants } from 'node:fs';
import path, { resolve } from 'node:path';

import * as fs from 'fs-extra';
import { omit } from 'ramda';

import {
  HikeDifficulty,
  HikePoint,
  latLonToGisPoint,
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

const withoutCompositeFields = omit([
  'referencePoints',
  'startPoint',
  'endPoint',
]);

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

  it('should import gpx file, save reference points, start and end points to db', async () => {
    const { localGuide } = await setup();

    const hikeData = {
      title: 'eeee',
      description: 'test desc',
      region: 'Torinio',
      province: 'TO',
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
      referencePoints: hikeData.referencePoints.map<Point>((refPoint) => ({
        ...withoutLatLon(refPoint),
        id: anyId(),
        position: latLonToGisPoint(refPoint),
        type: PointType.point,
      })),
      startPoint: {
        ...withoutLatLon(hikeData.startPoint),
        id: anyId(),
        address: null,
        position: null,
      },
      endPoint: {
        ...withoutLatLon(hikeData.endPoint),
        id: anyId(),
        name: null,
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

  it('should update hike', async () => {
    const { localGuide, hike } = await setup();

    const updateData = {
      title: 'new hike title',
      description: 'this is a new hike desc',
      region: 'Torinio',
      province: 'TO',
      length: 5.78,
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
          ...updateData,
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
