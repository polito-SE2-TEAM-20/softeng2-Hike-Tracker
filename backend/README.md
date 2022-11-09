# Backend for Hiking

## Preparation
- Install postgresql and run it
- Create database `hiking`
- Add postgis extension to database:
```
CREATE EXTENSION postgis;
```
- Install dependencies
```bash
$ npm install
$ cp .env.example .env
```
- Put db connection info into `.env`

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
