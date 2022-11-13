import { TypeID, UserRole } from '@app/common';
import { finishTest } from '@app/testing';
import { prepareTestApp, prepareVars } from '@test/base';

describe('Auth (e2e)', () => {
  let { dbName, app, restService, moduleRef } = prepareVars();

  beforeEach(async () => {
    ({ dbName, moduleRef, app, restService } = await prepareTestApp());
  });

  afterEach(async () => {
    await finishTest({ moduleRef, dbName });
  });

  // todo: account confirm
  it('should register user and support this data to login', async () => {
    const userData = {
      email: 'test@email.com',
      password: 'somePasswordToTest',
      role: UserRole.hiker,
      firstName: 'Test',
      lastName: 'User',
    };

    const { body: user } = await restService
      .build(app)
      .request()
      .post('/auth/register')
      .send(userData)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: expect.any(TypeID),
          email: userData.email,
        });
        expect(body).not.toHaveProperty('password');
      });

    const {
      body: { token },
    } = await restService
      .build(app)
      .request()
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          user: expect.objectContaining({ id: user.id, email: userData.email }),
          token: expect.any(String),
        });
        expect(body.user).not.toHaveProperty('password');
      });

    await restService
      .build(app)
      .auth(token)
      .request()
      .get('/auth/me')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({ id: user.id });
      });

    await restService.build(app).request().get('/auth/me').expect(401);
  });
});
