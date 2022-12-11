import { TypeID, User, UserRole } from '@app/common';
import { finishTest } from '@app/testing';
import { AuthService } from '@core/auth/auth.service';
import { prepareTestApp, prepareVars } from '@test/base';

const testUserData = {
  email: 'test@email.com',
  password: 'somePasswordToTest',
  firstName: 'Friend',
  lastName: 'User',
};

describe('Auth (e2e)', () => {
  let { dbName, app, restService, moduleRef, testService } = prepareVars();

  beforeEach(async () => {
    ({ dbName, moduleRef, app, restService, testService } =
      await prepareTestApp());
  });

  afterEach(async () => {
    await finishTest({ moduleRef, dbName });
  });

  it('should register user and support this data to login', async () => {
    const userData = {
      email: 'test@email.com',
      password: 'somePasswordToTest',
      role: UserRole.localGuide,
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '3332204738',
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

    await testService
      .repo(User)
      .update({ id: user.id }, { verified: true, approved: true });

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

  it('should not login with invalid credentials', async () => {
    await restService
      .build(app)
      .request()
      .post('/auth/login')
      .send({
        email: 'non-existing@email.com',
        password: '$$100$$',
      })
      .expect(401);
  });

  it('should not login when email is not confirmed', async () => {
    const authService = moduleRef.get(AuthService);
    const password = await authService.hashPassword('112233');
    const user = await testService.createUser({
      ...testUserData,
      password,
      verificationHash: '123',
      verified: false,
    });

    await restService
      .build(app)
      .request()
      .post('/auth/login')
      .send({
        email: user.email,
        password: '112233',
      })
      .expect(403);
  });

  it('should not register a friend', async () => {
    const userData = {
      ...testUserData,
      role: UserRole.friend,
    };

    await restService
      .build(app)
      .request()
      .post('/auth/register')
      .send(userData)
      .expect(403)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          message: 'Friend is not a valid role to register',
        });
      });
  });

  it('should not register a local guide w/o phone number', async () => {
    await restService
      .build(app)
      .request()
      .post('/auth/register')
      .send({
        ...testUserData,
        role: UserRole.localGuide,
      })
      .expect(403)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          message: 'Phone Number for this role is required',
        });
      });
  });

  it('should verify hash for user', async () => {
    const user = await testService.createUser({
      ...testUserData,
      verificationHash: '123',
      verified: false,
    });

    await restService
      .build(app)
      .request()
      .get(`/auth/verify/${user.verificationHash}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          'Account Verification': 'Successful',
        });
      });
  });

  it('should throw 422 when there is no user by hash', async () => {
    await testService.createUser({
      ...testUserData,
      verificationHash: 'another hash',
      verified: false,
    });

    await restService
      .build(app)
      .request()
      .get(`/auth/verify/non-existing-hash`)
      .expect(422);
  });

  it('should throw 400 when trying to verify while already verified', async () => {
    await testService.createUser({
      ...testUserData,
      verificationHash: '123456',
      verified: true,
    });

    await restService
      .build(app)
      .request()
      .get(`/auth/verify/123456`)
      .expect(409);
  });

  it('should throw 401 when using invalid jwt', async () => {
    const authService = moduleRef.get(AuthService);
    const password = await authService.hashPassword('112233');
    const user = await testService.createUser({
      ...testUserData,
      role: UserRole.localGuide,
      password,
      verificationHash: '123456',
      verified: true,
    });
    const jwt = await authService.signUserJwt(user);

    const hike = await testService.createHike({ userId: user.id });

    await restService
      .build(app)
      .auth({ ...user, token: jwt.slice(2) })
      .request()
      .put(`/hikes/${hike.id}`)
      .expect(401);
  });
});
