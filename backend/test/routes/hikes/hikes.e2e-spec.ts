import { resolve } from 'node:path';

import { HikePoint } from '@app/common';
import { finishTest } from '@app/testing';
import { prepareTestApp, prepareVars } from '@test/base';

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
    const user = await testService.createUser();

    return {
      user,
    };
  };

  it('should import gpx file and parse it into hikes with points', async () => {
    const { user } = await setup();

    const { body } = await restService
      .build(app, user)
      .request()
      .post('/hikes/import')
      .attach('gpxFile', resolve(__dirname, '../../../test-data/1.gpx'))
      .expect(200);

    expect(body.hikes).toHaveLength(1);

    expect(
      await testService.repo(HikePoint).findBy({ hikeId: body.hikes[0].id }),
    ).toHaveLength(500);
  });
});
