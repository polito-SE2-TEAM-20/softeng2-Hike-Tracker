import { randomInt } from 'node:crypto';
import { constants } from 'node:fs';
import path, { resolve } from 'node:path';

import * as fs from 'fs-extra';
import { omit } from 'ramda';

import {
  HikeDifficulty,
  HikePoint,
  ROOT,
  TypeID,
  UPLOAD_PATH,
  UserRole,
} from '@app/common';
import { finishTest } from '@app/testing';
import { mapArray, prepareTestApp, prepareVars } from '@test/base';

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

  it('should import gpx file, save reference points into db', async () => {
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
    };

    const { body: hike } = await restService
      .build(app, localGuide)
      .request()
      .post('/hikes/import')
      .attach('gpxFile', resolve(ROOT, './test-data/4.gpx'))
      .field(omit(['referencePoints'], hikeData))
      .field('referencePoints', JSON.stringify(hikeData.referencePoints))
      .expect(201);

    expect(hike).toMatchObject({ id: expect.any(TypeID), ...hikeData });
    expect(hike.gpxPath).toMatch(/^\/static\/gpx\/.+\.gpx$/);

    expect(
      fs.access(
        resolve(UPLOAD_PATH, path.basename(hike.gpxPath)),
        constants.F_OK,
      ),
    ).not.toReject();

    expect(
      await testService.repo(HikePoint).findBy({ hikeId: hike.id }),
    ).toHaveLength(1);
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
          id: hike.id,
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
                point: expect.objectContaining({ id: expect.any(Number) }),
              }),
            }),
          ),
          ...linkedHuts.map((entity) =>
            expect.objectContaining({
              type: 'hut',
              entity: expect.objectContaining({
                ...entity,
                point: expect.objectContaining({ id: expect.any(Number) }),
              }),
            }),
          ),
        ]);
      });
  });
});
