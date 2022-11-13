import { resolve } from 'node:path';

import { HikePoint, ROOT, TypeID } from '@app/common';
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
    const hike = await testService.createHike({ userId: user.id });

    return {
      user,
      hike,
    };
  };

  it('should import gpx file and parse it into hikes with points', async () => {
    const { user } = await setup();

    const hikeData = { title: 'eeee', description: 'test desc' };

    const { body } = await restService
      .build(app, user)
      .request()
      .post('/hikes/import')
      .attach('gpxFile', resolve(ROOT, './test-data/4.gpx'))
      .field('title', hikeData.title)
      .field('description', hikeData.description)
      .expect(201);

    expect(body).toMatchObject({ id: expect.any(TypeID), ...hikeData });
    expect(body.gpxPath).toMatch(/^\/static\/gpx\/.+\.gpx$/);

    expect(
      await testService.repo(HikePoint).findBy({ hikeId: body.id }),
    ).toHaveLength(500);
  });

  it('should update hike', async () => {
    const { user, hike } = await setup();

    const updateData = {
      title: 'new hike title',
      description: 'this is a new hike desc',
      region: 'Torinio',
      province: 'TO',
      length: 5.78,
    };

    await restService
      .build(app, user)
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
});
