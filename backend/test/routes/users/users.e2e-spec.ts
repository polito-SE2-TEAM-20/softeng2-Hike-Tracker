import {
  HikePoint,
  latLonToGisPoint,
  PerformanceStat,
  PointType,
  UserRole,
} from '@app/common';
import { finishTest } from '@app/testing';
import { mapArray, prepareTestApp, prepareVars } from '@test/base';

describe('Users Preferences (e2e)', () => {
  let { dbName, app, restService, moduleRef, testService } = prepareVars();

  beforeEach(async () => {
    ({ dbName, moduleRef, app, testService, restService } =
      await prepareTestApp());
  });

  afterEach(async () => {
    await finishTest({ moduleRef, dbName });
  });

  const setup = async () => {
    const user = await testService.createUser({ role: UserRole.hiker });
    const hiker = await testService.createUser({ role: UserRole.hiker });
    const localGuide = await testService.createUser({
      role: UserRole.localGuide,
    });
    const hike = await testService.createHike({ userId: localGuide.id });
    const hikeTwo = await testService.createHike({ userId: localGuide.id });
    const hikeThree = await testService.createHike({ userId: localGuide.id });

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

    return {
      hiker,
      user,
      hike,
      hikeTwo,
      hikeThree,
      points,
      randomPoints,
      localGuide,
    };
  };

  it('should set user preferences', async () => {
    const { user } = await setup();

    const preferences = {
      lat: 5.005,
      lon: 5.004,
      radiusKms: 10,
      minLength: 4010,
      maxLength: 6000,
      expectedTimeMin: 500,
      expectedTimeMax: 1500,
      difficultyMin: 1,
      difficultyMax: 2,
      ascentMin: 50,
      ascentMax: 150,
      suggestionType: false,
    };

    await restService
      .build(app, user)
      .request()
      .post('/me/set_preferences')
      .send(preferences)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          lat: preferences.lat,
          lon: preferences.lon,
          radiusKms: preferences.radiusKms,
          minLength: preferences.minLength,
          maxLength: preferences.maxLength,
          expectedTimeMin: preferences.expectedTimeMin,
          expectedTimeMax: preferences.expectedTimeMax,
          difficultyMin: preferences.difficultyMin,
          difficultyMax: preferences.difficultyMax,
          ascentMin: preferences.ascentMin,
          ascentMax: preferences.ascentMax,
          suggestionType: preferences.suggestionType,
        });
      });
  });

  it('should get user preferences', async () => {
    const { user } = await setup();

    const preferences = {
      lat: 5.005,
      lon: 5.004,
      radiusKms: 10,
      minLength: 4010,
      maxLength: 6000,
      expectedTimeMin: 500,
      expectedTimeMax: 1500,
      difficultyMin: 1,
      difficultyMax: 2,
      ascentMin: 50,
      ascentMax: 150,
      suggestionType: false,
    };

    await restService
      .build(app, user)
      .request()
      .post('/me/set_preferences')
      .send(preferences)
      .expect(201);

    await restService
      .build(app, user)
      .request()
      .get('/me/preferences')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          lat: preferences.lat,
          lon: preferences.lon,
          radiusKms: preferences.radiusKms,
          minLength: preferences.minLength,
          maxLength: preferences.maxLength,
          expectedTimeMin: preferences.expectedTimeMin,
          expectedTimeMax: preferences.expectedTimeMax,
          difficultyMin: preferences.difficultyMin,
          difficultyMax: preferences.difficultyMax,
          ascentMin: preferences.ascentMin,
          ascentMax: preferences.ascentMax,
          suggestionType: preferences.suggestionType,
        });
      });
  });

  it('should calculate performance stats', async () => {
    const { hiker, hike, hikeTwo } = await setup();

    await testService.createUserHike({
      finishedAt: new Date(),
      startedAt: new Date(),
      hikeId: hike.id,
      userId: hiker.id,
      psAltitudeRange: 30,
      psAverageSpeed: 12,
      psAverageVerticalAscentSpeed: 0.5,
      psHighestAltitude: 200,
      psTotalKms: 10.33,
      psTotalTimeMinutes: 53,
    });

    await testService.createUserHike({
      finishedAt: new Date(),
      startedAt: new Date(),
      hikeId: hikeTwo.id,
      userId: hiker.id,
      psAltitudeRange: 10,
      psAverageSpeed: 15,
      psAverageVerticalAscentSpeed: 1.5,
      psHighestAltitude: 130,
      psTotalKms: 5.81,
      psTotalTimeMinutes: 24,
    });

    await restService
      .build(app, hiker)
      .request()
      .get('/me/performance-stats')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({ stats: expect.any(Array) });
        expect(body.stats).toIncludeSameMembers([
          {
            stat: PerformanceStat.averagePace,
            value: expect.closeTo(13.5, 2),
            unit: 'min/km',
          },
          {
            stat: PerformanceStat.averageVerticalAscentSpeed,
            value: 1,
            unit: 'm/h',
          },
          {
            stat: PerformanceStat.fastestPace,
            value: 15,
            unit: 'min/km',
          },
          {
            stat: PerformanceStat.highestAltitudeReached,
            value: 200,
            unit: 'm',
          },
          {
            stat: PerformanceStat.largestAltitudeRange,
            value: 30,
            unit: 'm',
          },
          {
            stat: PerformanceStat.longestHikeDistanceKms,
            value: 10.33,
            unit: 'km',
          },
          {
            stat: PerformanceStat.longestHikeTimeHours,
            value: expect.closeTo(53 / 60, 2),
            unit: 'h',
          },
          {
            stat: PerformanceStat.shortestHikeDistanceKms,
            value: 5.81,
            unit: 'km',
          },
          {
            stat: PerformanceStat.shortestHikeTimeHours,
            value: 0.4,
            unit: 'h',
          },
          {
            stat: PerformanceStat.totalHikesFinished,
            value: 2,
            unit: 'hike',
          },
          {
            stat: PerformanceStat.totalKmsWalked,
            value: 16.14,
            unit: 'km',
          },
        ]);
      });
  });

  it('should add multiple hikes to the planned ones', async () => {
    const { user, hike, hikeTwo, hikeThree, localGuide } = await setup();

    const plannedHikes = {
      plannedHikes: [hike.id, hikeTwo.id, hikeThree.id],
    };

    await restService
      .build(app, user)
      .request()
      .post('/me/set_planned_hikes')
      .send(plannedHikes)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject([
          {
            id: hike.id,
            userId: localGuide.id,
            length: 0,
            expectedTime: 0,
            ascent: 0,
            distance: 0,
            difficulty: 0,
            condition: 0,
            weatherStatus: 0,
            weatherDescription: '',
            cause: '',
            title: '',
            description: '',
            gpxPath: null,
            region: '',
            province: '',
            city: '',
            country: '',
            pictures: [],
          },
          {
            id: hikeTwo.id,
            userId: localGuide.id,
            length: 0,
            expectedTime: 0,
            ascent: 0,
            distance: 0,
            difficulty: 0,
            condition: 0,
            weatherStatus: 0,
            weatherDescription: '',
            cause: '',
            title: '',
            description: '',
            gpxPath: null,
            region: '',
            province: '',
            city: '',
            country: '',
            pictures: [],
          },
          {
            id: hikeThree.id,
            userId: localGuide.id,
            length: 0,
            expectedTime: 0,
            ascent: 0,
            distance: 0,
            difficulty: 0,
            condition: 0,
            weatherStatus: 0,
            weatherDescription: '',
            cause: '',
            title: '',
            description: '',
            gpxPath: null,
            region: '',
            province: '',
            city: '',
            country: '',
            pictures: [],
          },
        ]);
      });
  });

  it('should return error 422 because the hike does not exist', async () => {
    const { user, hike, hikeTwo } = await setup();

    const plannedHikes = {
      plannedHikes: [hike.id, hikeTwo.id, 7],
    };

    await restService
      .build(app, user)
      .request()
      .post('/me/set_planned_hikes')
      .send(plannedHikes)
      .expect(422);
  });

  it('should get all the planned hikes', async () => {
    const { user, hike, hikeTwo, localGuide } = await setup();

    const plannedHikes = {
      plannedHikes: [hike.id, hikeTwo.id],
    };

    await restService
      .build(app, user)
      .request()
      .post('/me/set_planned_hikes')
      .send(plannedHikes)
      .expect(201);

    await restService
      .build(app, user)
      .request()
      .get('/me/planned_hikes')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject([
          {
            id: hike.id,
            userId: localGuide.id,
            length: 0,
            expectedTime: 0,
            ascent: 0,
            distance: 0,
            difficulty: 0,
            condition: 0,
            weatherStatus: 0,
            weatherDescription: '',
            cause: '',
            title: '',
            description: '',
            gpxPath: null,
            region: '',
            province: '',
            city: '',
            country: '',
            pictures: [],
          },
          {
            id: hikeTwo.id,
            userId: localGuide.id,
            length: 0,
            expectedTime: 0,
            ascent: 0,
            distance: 0,
            difficulty: 0,
            condition: 0,
            weatherStatus: 0,
            weatherDescription: '',
            cause: '',
            title: '',
            description: '',
            gpxPath: null,
            region: '',
            province: '',
            city: '',
            country: '',
            pictures: [],
          },
        ]);
      });
  });

  it('should return error 404 because there are no planned hikes', async () => {
    const { user } = await setup();

    await restService
      .build(app, user)
      .request()
      .get('/me/planned_hikes')
      .expect(404);
  });

  it('should delete two hikes from the planned hikes', async () => {
    const { user, hike, hikeTwo, hikeThree, localGuide } = await setup();

    const plannedHikes = {
      plannedHikes: [hike.id, hikeTwo.id, hikeThree.id],
    };

    const removeHikes = {
      plannedHikes: [hike.id, hikeThree.id],
    };

    await restService
      .build(app, user)
      .request()
      .post('/me/set_planned_hikes')
      .send(plannedHikes)
      .expect(201);

    await restService
      .build(app, user)
      .request()
      .delete('/me/planned_hikes')
      .send(removeHikes)
      .expect(204);

    await restService
      .build(app, user)
      .request()
      .get('/me/planned_hikes')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject([
          {
            id: hikeTwo.id,
            userId: localGuide.id,
            length: 0,
            expectedTime: 0,
            ascent: 0,
            distance: 0,
            difficulty: 0,
            condition: 0,
            weatherStatus: 0,
            weatherDescription: '',
            cause: '',
            title: '',
            description: '',
            gpxPath: null,
            region: '',
            province: '',
            city: '',
            country: '',
            pictures: [],
          },
        ]);
      });
  });

  it('should return error 422 because you have not planned the hike you want to remove', async () => {
    const { user, hike, hikeTwo, hikeThree } = await setup();

    const plannedHikes = {
      plannedHikes: [hike.id, hikeTwo.id, hikeThree.id],
    };

    const removeHikes = {
      plannedHikes: [hike.id, 18],
    };

    await restService
      .build(app, user)
      .request()
      .post('/me/set_planned_hikes')
      .send(plannedHikes)
      .expect(201);

    await restService
      .build(app, user)
      .request()
      .delete('/me/planned_hikes')
      .send(removeHikes)
      .expect(422);
  });
});
