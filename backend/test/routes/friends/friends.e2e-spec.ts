import {
    UserRole,
  } from '@app/common';
  import { finishTest } from '@app/testing';
  import {
    anyId,
    prepareTestApp,
    prepareVars,
    strDate,
  } from '@test/base';
import exp from 'constants';
  import { any, pick } from 'ramda';
import { timestamp } from 'rxjs';

  const pickCommon = (el: any) => ({
    ...pick(['id', 'userId']),
    startedAt: el.startedAt ? strDate(el.startedAt) : null,
    hike: expect.objectContaining({ id: el.hikeId }),
  });
  
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
  
      return {
        localGuide,
        hiker,
        hike,
        userHike,
        hiker2,
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
        })
  
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


        const { body: res} = await restService
        .build(app, hiker2)
        .request()
        .post('/friends/share')
        .expect(201)
        .expect(({ body }) => {
          expect(body.Code).toHaveLength(4);
        })
    
  
          await restService
          .build(app, hiker2)
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
          })
    
      });
});