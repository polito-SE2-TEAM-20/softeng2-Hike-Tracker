import { UserRole } from '@app/common';
import { finishTest } from '@app/testing';
import { prepareTestApp, prepareVars } from '@test/base';

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
    const user = await testService.createUser({role: UserRole.hiker});

    return {
      user,
    };
  };

  it('should set user preferences', async () => {
    const { user } = await setup();
  
    const preferences = {
        "lat": 5.005,
        "lon": 5.004,
        "radiusKms": 10,
        "length": 5000,
        "expectedTime": 1000,
        "difficulty": 2,
        "ascent": 100
    }

    await restService
      .build(app, user)
      .request()
      .post('/me/set_preferences')
      .send(preferences)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
            "lat": preferences.lat,
            "lon": preferences.lon,
            "radiusKms": preferences.radiusKms,
            "length": preferences.length,
            "expectedTime": preferences.expectedTime,
            "difficulty": preferences.difficulty,
            "ascent": preferences.ascent
        });
      });
  });


  it('should get user preferences', async () => {
    const { user } = await setup();

    const preferences = {
        "lat": 5.005,
        "lon": 5.004,
        "radiusKms": 10,
        "length": 5000,
        "expectedTime": 1000,
        "difficulty": 2,
        "ascent": 100
    }

    await restService
    .build(app, user)
    .request()
    .post('/me/set_preferences')
    .send(preferences)
    .expect(201)

    await restService
    .build(app, user)
    .request()
    .get('/me/preferences')
    .expect(200)
    .expect(({ body }) => {
      expect(body).toMatchObject({
          "lat": preferences.lat,
          "lon": preferences.lon,
          "radiusKms": preferences.radiusKms,
          "length": preferences.length,
          "expectedTime": preferences.expectedTime,
          "difficulty": preferences.difficulty,
          "ascent": preferences.ascent
      });
    });


  });
})
