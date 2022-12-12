import { finishTest } from '@app/testing';
import { prepareTestApp, prepareVars } from '@test/base';

describe('Healthcheck (e2e)', () => {
  let { dbName, app, restService, moduleRef } = prepareVars();

  beforeEach(async () => {
    ({ dbName, moduleRef, app, restService } = await prepareTestApp());
  });

  afterEach(async () => {
    await finishTest({ moduleRef, dbName });
  });

  it('should return ok on healthcheck', async () => {
    await restService
      .build(app)
      .request()
      .get('/')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          status: 'ok',
        });
      });

    await restService
      .build(app)
      .request()
      .get('/healthcheck')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          status: 'ok',
        });
      });
  });
});
