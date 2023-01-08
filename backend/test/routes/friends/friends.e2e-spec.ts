import { pick } from 'ramda';

import { UserRole, PointType, latLonToGisPoint, HikePoint } from '@app/common';
import { finishTest } from '@app/testing';
import {
  anyId,
  prepareTestApp,
  prepareVars,
  strDate,
  mapArray,
} from '@test/base';

const pickCommon = (el: any) => ({
  ...pick(['id', 'userId']),
  startedAt: el.startedAt ? strDate(el.startedAt) : null,
  hike: expect.objectContaining({ id: el.hikeId }),
});

const isoDateNow = () => strDate(new Date());

describe('Friends (e2e)', () => {
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
    const hiker2 = await testService.createUser({
      role: UserRole.hiker,
    });
    const localGuide = await testService.createUser({
      role: UserRole.localGuide,
    });
    const hike = await testService.createHike({ userId: localGuide.id });

    const userHike = await testService.createUserHike({
      userId: hiker.id,
      hikeId: hike.id,
    });

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

    return {
      localGuide,
      hiker,
      hike,
      userHike,
      hiker2,
      points,
    };
  };

  it('should generate a random code associated to the hike', async () => {
    const { hiker2, hike } = await setup();

    await restService
      .build(app, hiker2)
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

    await restService
      .build(app, hiker2)
      .request()
      .post('/friends/share')
      .expect(201)
      .expect(({ body }) => {
        expect(body.Code).toHaveLength(4);
      });
  });

  it('should return the ongoing hike associated to the code', async () => {
    const { hiker2, hike, userHike } = await setup();

    await restService
      .build(app, hiker2)
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

    const { body: res } = await restService
      .build(app, hiker2)
      .request()
      .post('/friends/share')
      .expect(201)
      .expect(({ body }) => {
        expect(body.Code).toHaveLength(4);
      });

    await restService
      .build(app)
      .request()
      .get(`/friends/track/${res.Code}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          ...pickCommon(userHike),
          startedAt: expect.any(String),
          finishedAt: null,
          trackPoints: [],
        });
      });
  });

  it('should get all reached reference points for the friend given the code', async () => {
    const { hiker2, hike, points } = await setup();
    const datetime = isoDateNow();

    await restService
      .build(app, hiker2)
      .request()
      .post(`/user-hikes/start`)
      .send({
        hikeId: hike.id,
      })
      .expect(200);

    await restService
      .build(app, hiker2)
      .request()
      .post(`/user-hikes/${2}/track-point`)
      .send({
        pointId: points[0].id,
        datetime,
      })
      .expect(200);

    await restService
      .build(app, hiker2)
      .request()
      .post(`/user-hikes/${2}/track-point`)
      .send({
        pointId: points[1].id,
        datetime,
      })
      .expect(200);

    const { body: res } = await restService
      .build(app, hiker2)
      .request()
      .post('/friends/share')
      .expect(201)
      .expect(({ body }) => {
        expect(body.Code).toHaveLength(4);
      });

    console.log(res);
    await restService
      .build(app)
      .request()
      .get(`/friends/track/${res.Code}`)
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
