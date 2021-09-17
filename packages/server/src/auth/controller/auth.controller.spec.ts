import { INestApplication } from '@nestjs/common';
import faker from 'faker';
import {
  getInvalidPassword,
  getTokenFromHTML,
  getValidEmail,
  getValidLoginCredentials,
  getValidRegisterCredentials,
} from '../../test-utils/auth';

import mongoose from 'mongoose';
import {
  buildMockTransportFactory,
  cleanupDB,
  makeTestModule,
  testGet,
  testPost,
} from '../../test-utils/common';
import { AuthController } from './auth.controller';
import { UserTestBedService } from '../../test-utils/user/user.test-bed.service';

describe('Auth Module', () => {
  let app: INestApplication;
  let userTestBedService: UserTestBedService;
  let sendMailSpy;

  beforeEach(async () => {
    const { transporter, spy } = await buildMockTransportFactory();
    sendMailSpy = spy;
    app = await makeTestModule(
      [AuthController],
      [UserTestBedService, transporter],
    );
    await app.init();
    userTestBedService = app.get(UserTestBedService);
  });

  afterEach(async () => {
    await cleanupDB(mongoose);
  });

  describe('Registeration', () => {
    it('creates user when POST /register with correct credentials', () => {
      return testPost(app, '/auth/register', () => '')
        .send(getValidRegisterCredentials())
        .expect(201);
    });
    it('returns error when POST /register with invalid email', () => {
      return testPost(app, '/auth/register', () => '')
        .send({
          ...getValidRegisterCredentials(),
          email: getInvalidPassword(),
        })
        .expect(400);
    });
    it('returns error when POST /register with invalid password', () => {
      return testPost(app, '/auth/register', () => '')
        .send({
          ...getValidRegisterCredentials(),
          password: getInvalidPassword(),
        })
        .expect(400);
    });
  });

  describe('Login', () => {
    it('returns token when POST /login with valid user', async () => {
      const { document: _, user } = await userTestBedService.insertUser();
      return testPost(app, '/auth/login', () => '')
        .send({
          ...user.credentials,
        })
        .expect(201)
        .expect(req => {
          expect(req.body.access_token).toBeTruthy();
        });
    });

    it('returns error when POST /login with unregistered user', () => {
      return testPost(app, '/auth/login', () => '')
        .send({
          ...getValidLoginCredentials(),
        })
        .expect(404);
    });
  });

  describe('Reset Password', () => {
    let credentials;

    beforeEach(async () => {
      const { document: _, user } = await userTestBedService.insertUser();
      credentials = user.credentials;
    });

    it('returns 201 when POST /auth/reset-password', async () => {
      return testPost(app, '/auth/reset-password', () => '')
        .send({ email: credentials.email })
        .expect(201)
        .expect(() => {
          expect(sendMailSpy).toHaveBeenCalledTimes(1);
          expect(sendMailSpy.mock.calls[0][0].message.to[0]).toMatchObject({
            email: credentials.email,
            name: credentials.email,
            type: 'to',
          });
        });
    });
    it('returns 201 but doesnt sends email with wrong emailId provided when POST /auth/reset-password', async () => {
      return testPost(app, '/auth/reset-password', () => '')
        .send({ email: getValidEmail() })
        .expect(201)
        .expect(() => {
          expect(sendMailSpy).toHaveBeenCalledTimes(0);
        });
    });

    it('returns 200 when given a valid reset password token when GET /auth/reset-password/:token/verify', async () => {
      await testPost(app, `/auth/reset-password/`, () => '')
        .send({
          email: credentials.email,
        })
        .expect(201);
      const { html } = sendMailSpy.mock.calls[0][0].message;
      expect(html).toBeDefined();
      const token = getTokenFromHTML(html);
      expect(token).toBeDefined();
      return testGet(app, `/auth/reset-password/${token}/verify`).expect(200);
    });
    it('returns 401 when given an invalid reset password token when GET /auth/reset-password/:token/verify', () => {
      const token = faker.random.words(10);
      return testGet(app, `/auth/reset-password/${token}/verify`).expect(401);
    });

    it('returns 201 when given a valid reset password and token when POST /auth/reset-password/:token', async () => {
      await testPost(app, `/auth/reset-password/`, () => '')
        .send({
          email: credentials.email,
        })
        .expect(201);
      const { html } = sendMailSpy.mock.calls[0][0].message;
      const token = getTokenFromHTML(html);

      const { password } = getValidRegisterCredentials();
      return testPost(app, `/auth/reset-password/${token}`, () => '')
        .send({
          password,
        })
        .expect(201);
    });
    it('returns 400 when given an invalid reset password and valid token when POST /auth/reset-password/:token', async () => {
      await testPost(app, `/auth/reset-password/`, () => '')
        .send({
          email: credentials.email,
        })
        .expect(201);
      const { html } = sendMailSpy.mock.calls[0][0].message;
      const token = getTokenFromHTML(html);

      const password = getInvalidPassword();
      return testPost(app, `/auth/reset-password/${token}`, () => '')
        .send({
          password,
        })
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
