import { omit, pick } from 'ramda';

import {
  latLonToGisPoint,
  mapToId,
  UserHikeState,
  UserHikeTrackPoint,
  UserRole,
} from '@app/common';
import { finishTest } from '@app/testing';
import {
  anyId,
  mapArray,
  prepareTestApp,
  prepareVars,
  strDate,
} from '@test/base';

const pickCommon = (el: any) => ({
  ...pick(['id', 'userId']),
  startedAt: el.startedAt ? strDate(el.startedAt) : null,
});

const convertTrackPoints = (trackPoints: UserHikeTrackPoint[]) =>
  trackPoints.map((el) => ({
    ...omit(['createdAt'], el),
    createdAt: strDate(el.createdAt),
    position: {
      type: 'Point',
      coordinates: el.position?.coordinates,
    },
  }));

describe('User Hikes (e2e)', () => {
  let { dbName, app, restService, moduleRef, testService } = prepareVars();

  beforeEach(async () => {
    ({ dbName, moduleRef, app, testService, restService } =
      await prepareTestApp());
  });

  afterEach(async () => {
    await finishTest({ moduleRef, dbName });
  });

  const setup = async () => {
    const hiker = await testService.createUser({
      role: UserRole.hiker,
    });
    const userTwo = await testService.createUser({
      role: UserRole.hiker,
    });
    const localGuide = await testService.createUser({
      role: UserRole.localGuide,
    });
    const hike = await testService.createHike({ userId: localGuide.id });
    const hikeTwo = await testService.createHike({ userId: localGuide.id });

    const userHike = await testService.createUserHike({
      userId: hiker.id,
      hikeId: hike.id,
    });

    return {
      localGuide,
      hiker,
      hike,
      hikeTwo,
      userHike,
      userTwo,
    };
  };

  it('should start new hike', async () => {
    const { hiker, hike } = await setup();

    await restService
      .build(app, hiker)
      .request()
      .post(`/user-hikes/start`)
      .send({
        hikeId: hike.id,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: anyId(),
          finishedAt: null,
          hikeId: hike.id,
        });
        expect(Date.now() - new Date(body.startedAt).getTime()).toBeLessThan(
          1000 * 2,
        );
      });
  });

  it('should return full user hike with all points', async () => {
    const { hiker, userHike } = await setup();

    const trackPoints = await mapArray(10, (i) =>
      testService.createUserHikeTrackPoint({
        userHikeId: userHike.id,
        index: i + 1,
        position: latLonToGisPoint({
          lat: 49 + 1 * Math.sin(i),
          lon: 128 - 1 * Math.cos(i),
        }),
      }),
    );

    await restService
      .build(app, hiker)
      .request()
      .get(`/user-hikes/${userHike.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          ...pickCommon(userHike),
          finishedAt: null,
          trackPoints: convertTrackPoints(trackPoints),
        });
      });
  });

  it('should add point to hike', async () => {
    const { hiker, userHike } = await setup();

    const existingTrackPoints = await mapArray(2, (i) =>
      testService.createUserHikeTrackPoint({
        userHikeId: userHike.id,
        index: i + 1,
        position: latLonToGisPoint({
          lat: 49 + 1 * Math.sin(i),
          lon: 128 - 1 * Math.cos(i),
        }),
      }),
    );

    const position = {
      lat: 49.53,
      lon: 127.77,
    };

    await restService
      .build(app, hiker)
      .request()
      .post(`/user-hikes/${userHike.id}/track-point`)
      .send({
        position,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          ...pickCommon(userHike),
          finishedAt: null,
        });
        expect(body.trackPoints).toHaveLength(3);
        expect(body.trackPoints).toIncludeAllMembers([
          ...convertTrackPoints(existingTrackPoints),
          {
            index: 3,
            userHikeId: userHike.id,
            position: {
              type: 'Point',
              coordinates: [position.lon, position.lat],
            },
            createdAt: expect.any(String),
          },
        ]);
      });
  });

  it('should finish hike', async () => {
    const { hiker, userHike } = await setup();

    await restService
      .build(app, hiker)
      .request()
      .post(`/user-hikes/${userHike.id}/finish`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          ...pickCommon(userHike),
        });
        expect(Date.now() - new Date(body.finishedAt).getTime()).toBeLessThan(
          1000 * 2,
        );
      });
  });

  it('should throw 403 when trying to access hike of others', async () => {
    const { userTwo, userHike } = await setup();

    await restService
      .build(app, userTwo)
      .request()
      .post(`/user-hikes/${userHike.id}/finish`)
      .expect(403);
  });

  it('should return list of my tracked hikes', async () => {
    const { hikeTwo, hiker, userHike } = await setup();

    // create some hike
    const userHikeTwo = await testService.createUserHike({
      userId: hiker.id,
      hikeId: hikeTwo.id,
      startedAt: new Date(Date.now() - 1000 * 3600 * 130),
    });

    await restService
      .build(app, hiker)
      .request()
      .post('/me/tracked-hikes')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);
        expect(mapToId(body)).toIncludeAllMembers(
          mapToId([userHikeTwo, userHike]),
        );
      });
  });

  it('should filter my tracked hikes', async () => {
    const { hikeTwo, hiker } = await setup();

    // create finished hikes
    const userHikeTwo = await testService.createUserHike({
      userId: hiker.id,
      hikeId: hikeTwo.id,
      startedAt: new Date(Date.now() - 1000 * 3600 * 138),
      finishedAt: new Date(Date.now() - 1000 * 3600 * 130),
    });
    const userHikeThree = await testService.createUserHike({
      userId: hiker.id,
      hikeId: hikeTwo.id,
      startedAt: new Date(Date.now() - 1000 * 3600 * 511),
      finishedAt: new Date(Date.now() - 1000 * 3600 * 520),
    });

    await restService
      .build(app, hiker)
      .request()
      .post('/me/tracked-hikes')
      .send({ state: UserHikeState.finished })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(2);
        expect(mapToId(body)).toIncludeAllMembers(
          mapToId([userHikeTwo, userHikeThree]),
        );
      });
  });
});
