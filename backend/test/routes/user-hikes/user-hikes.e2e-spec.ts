import { omit, pick } from 'ramda';

import {
  HikePoint,
  latLonToGisPoint,
  mapToId,
  PointType,
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
import { testMapPoint } from '@test/base/test.mappers';

const isoDateNow = () => strDate(new Date());
const pickCommon = (el: any) => ({
  ...pick(['id', 'userId']),
  startedAt: el.startedAt ? strDate(el.startedAt) : null,
  hike: expect.objectContaining({ id: el.hikeId }),
});

const convertTrackPoints = (trackPoints: UserHikeTrackPoint[]) =>
  trackPoints.map((el) => ({
    ...omit(['datetime'], el),
    datetime: strDate(el.datetime),
    point: expect.objectContaining({
      id: anyId(),
      position: expect.any(Object),
    }),
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
    const emergencyOperator = await testService.createUser({
      role: UserRole.emergencyOperator,
    });
    const userTwo = await testService.createUser({
      role: UserRole.hiker,
    });
    const localGuide = await testService.createUser({
      role: UserRole.localGuide,
    });
    const hike = await testService.createHike({ userId: localGuide.id });
    const hikeTwo = await testService.createHike({ userId: localGuide.id });
    const points = await mapArray(10, (i) =>
      testService.createPoint({
        address: `${i}th street`,
        position: latLonToGisPoint({
          lat: 49 + 1 * Math.sin(i),
          lon: 128 - 1 * Math.cos(i),
        }),
        type: PointType.point,
      }),
    );

    // add as reference points
    await testService.repo(HikePoint).save(
      points.map<HikePoint>((p, index) => ({
        pointId: p.id,
        hikeId: hike.id,
        type: PointType.referencePoint,
        index,
      })),
    );

    const randomPoints = await mapArray(10, (i) =>
      testService.createPoint({
        address: `Berkley, ${i + 1}/${Math.floor((i + 1) ** 2 / 3)}`,
        position: latLonToGisPoint({
          lat: 49 + 1.5 * Math.sin(i),
          lon: 128 - 1.5 * Math.cos(i),
        }),
        type: PointType.point,
      }),
    );

    const userHike = await testService.createUserHike({
      userId: hiker.id,
      hikeId: hike.id,
    });

    return {
      localGuide,
      emergencyOperator,
      hiker,
      hike,
      points,
      randomPoints,
      hikeTwo,
      userHike,
      userTwo,
    };
  };

  it('should start new hike', async () => {
    const { userTwo, hike } = await setup();

    await restService
      .build(app, userTwo)
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

  it('should not allow to start multiple hikes for same hike', async () => {
    const { hiker, hike } = await setup();

    await restService
      .build(app, hiker)
      .request()
      .post(`/user-hikes/start`)
      .send({
        hikeId: hike.id,
      })
      .expect(400);
  });

  it('should return full user hike with all points', async () => {
    const { hiker, userHike, points } = await setup();

    const trackPoints = await mapArray(10, (i) =>
      testService.createUserHikeTrackPoint({
        userHikeId: userHike.id,
        index: i + 1,
        pointId: points[i].id,
        datetime: new Date(),
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

  it('should throw an error if hike is not found', async () => {
    const { hiker } = await setup();

    await restService
      .build(app, hiker)
      .request()
      .get('/user-hikes/100')
      .expect(404)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          message: 'UserHike not found',
        });
      });
  });

  it('should not allow to track non-existing point', async () => {
    const { hiker, userHike } = await setup();

    await restService
      .build(app, hiker)
      .request()
      .post(`/user-hikes/${userHike.id}/track-point`)
      .send({
        pointId: 10322,
        datetime: isoDateNow(),
      })
      .expect(500)
      .expect(({ body }) => {
        expect(body).toMatchObject({ message: 'Point not found' });
      });
  });

  it('should not allow to track point that is not a reference point of a hike', async () => {
    const { hiker, userHike, randomPoints } = await setup();

    await restService
      .build(app, hiker)
      .request()
      .post(`/user-hikes/${userHike.id}/track-point`)
      .send({
        pointId: randomPoints[3].id,
        datetime: isoDateNow(),
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          message: 'This point is not a reference point for this hike',
        });
      });
  });

  it('should add point to hike', async () => {
    const { hiker, userHike, hikeTwo, points, randomPoints } = await setup();

    const existingTrackPoints = await mapArray(2, (i) =>
      testService.createUserHikeTrackPointWithPosition(
        {
          userHikeId: userHike.id,
          index: i + 1,
        },
        {
          position: latLonToGisPoint({
            lat: 49 + 1 * Math.sin(i),
            lon: 128 - 1 * Math.cos(i),
          }),
        },
      ),
    );

    const referencePoint = points[2];
    const datetime = isoDateNow();

    await restService
      .build(app, hiker)
      .request()
      .post(`/user-hikes/${userHike.id}/track-point`)
      .send({
        pointId: referencePoint.id,
        datetime,
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
            datetime,
            pointId: referencePoint.id,
            point: testMapPoint(referencePoint),
            userHikeId: userHike.id,
          },
        ]);
      });

    const userHikeTwo = await testService.createUserHike({
      userId: hiker.id,
      hikeId: hikeTwo.id,
    });

    // prepare some reference points for hike two
    // add as reference points
    await Promise.all(
      randomPoints.slice(0, 3).map((point, index) =>
        testService.createHikePoint({
          hikeId: hikeTwo.id,
          pointId: point.id,
          type: PointType.referencePoint,
          index,
        }),
      ),
    );

    const newDatetime = isoDateNow();
    await restService
      .build(app, hiker)
      .request()
      .post(`/user-hikes/${userHikeTwo.id}/track-point`)
      .send({
        pointId: randomPoints[0].id,
        datetime: newDatetime,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.trackPoints).toHaveLength(1);
        expect(body.trackPoints).toIncludeAllMembers([
          {
            datetime: newDatetime,
            index: 1,
            pointId: randomPoints[0].id,
            point: testMapPoint(randomPoints[0]),
            userHikeId: userHikeTwo.id,
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

  it('should allow emergencyOperator to see any hike', async () => {
    const { emergencyOperator, userHike } = await setup();

    await restService
      .build(app, emergencyOperator)
      .request()
      .get(`/user-hikes/${userHike.id}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({ id: userHike.id });
      });
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
    const { hikeTwo, hike, hiker } = await setup();

    // create finished hikes
    const userHikeTwo = await testService.createUserHike({
      userId: hiker.id,
      hikeId: hike.id,
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

  it('should get all reached reference points for the user', async () => {
    const { userTwo, hike, points } = await setup();
    const datetime = isoDateNow();

    await restService
      .build(app, userTwo)
      .request()
      .post(`/user-hikes/start`)
      .send({
        hikeId: hike.id,
      })
      .expect(200);

    await restService
      .build(app, userTwo)
      .request()
      .post(`/user-hikes/${2}/track-point`)
      .send({
        pointId: points[0].id,
        datetime,
      })
      .expect(200);

    await restService
      .build(app, userTwo)
      .request()
      .post(`/user-hikes/${2}/track-point`)
      .send({
        pointId: points[1].id,
        datetime,
      })
      .expect(200);

    await restService
      .build(app, userTwo)
      .request()
      .get(`/user-hikes/reached-points`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.trackPoints).toMatchObject([
          {
            userHikeId: 2,
            pointId: points[0].id,
            index: expect.any(Number),
            datetime: expect.any(String),
            point: {
              id: points[0].id,
              type: points[0].type,
              position: {
                type: points[0].position?.type,
                coordinates: points[0].position?.coordinates,
              },
              address: points[0].address,
              name: points[0].name,
              altitude: points[0].altitude,
            },
          },
          {
            userHikeId: 2,
            pointId: points[1].id,
            index: expect.any(Number),
            datetime: expect.any(String),
            point: {
              id: points[1].id,
              type: points[1].type,
              position: {
                type: points[1].position?.type,
                coordinates: points[1].position?.coordinates,
              },
              address: points[1].address,
              name: points[1].name,
              altitude: points[1].altitude,
            },
          },
        ]);
      });
  });
});
