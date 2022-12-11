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
    const user = await testService.createUser({ role: UserRole.hiker });

    return {
      user,
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
});
