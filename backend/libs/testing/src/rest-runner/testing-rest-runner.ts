/* eslint-disable @typescript-eslint/ban-ts-comment */
import { INestApplication } from '@nestjs/common';
import { isNil } from 'ramda';
import request from 'supertest';

import { UserAuthData } from '../types';

export interface BuilderOpitons {
  app?: INestApplication;
  supertest?: typeof request;
  host?: string;
}

// https://gist.github.com/patrixr/2536ee396d488bd5e38b0278513eefeb

export class TestingRestRunner {
  protected app?: INestApplication;
  protected req!: request.SuperTest<request.Test>;
  protected supertest?: typeof request;
  protected _wrapper: request.SuperAgentTest; //request.SuperTest<request.Test>;
  protected bearerToken!: string;
  protected _host?: string;
  protected checkWithoutErrors = false;

  constructor({ app, host }: BuilderOpitons) {
    this.app = app;

    this._host = host;

    if (host) {
      this._wrapper = request.agent(host);
    } else if (app) {
      this._wrapper = request.agent(app.getHttpServer());
    } else {
      throw new Error('You need to either pass "app" or "host" in constructor');
    }
  }

  auth(_user: UserAuthData): this {
    if (typeof _user === 'string') {
      this.bearerToken = _user;
    } else if ('token' in _user && !isNil(_user.token)) {
      this.bearerToken = _user.token;
    }

    return this;
  }

  request(
    additionalHeaders: Record<string, string> = {},
  ): request.SuperAgentTest {
    const headers: typeof additionalHeaders = {
      ...this.authData,
      ...additionalHeaders,
    };

    const req = this._wrapper;

    Object.keys(headers).forEach((header) => {
      req.set(header, headers[header]);
    });

    this.req = req;

    return req;
  }

  /**
   * Add explicit `expect()` check for errors being nullish or empty array \
   * **This will add an additonal `expect` check when using `expect.asertions()`**
   */
  withoutErrors(): this {
    this.checkWithoutErrors = true;

    return this;
  }

  host(host: string): this {
    this._host = host;

    return this;
  }

  execute() {
    return this.req;
  }

  clone() {
    const copy = new TestingRestRunner({
      app: this.app,
      supertest: this.supertest,
      host: this._host,
    });

    return copy;
  }

  get authData(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.bearerToken) {
      headers['authorization'] = `Bearer ${this.bearerToken}`;
    }

    return headers;
  }
}
