import { randomInt } from 'crypto';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { mergeRight } from 'ramda';
import type {
  DataSource,
  DeepPartial,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';

import {
  Hike,
  HikePoint,
  HikePointPrimaryKey,
  Hut,
  ID,
  isNotNil,
  ParkingLot,
  Point,
  PointType,
  User,
  UserHike,
  UserHikeTrackPoint,
  UserRole,
  WithPoint,
} from '@app/common';

import { CONNECTION_NAME } from './testing.constants';

export interface IJwtService {
  signUserJwt(user: User): Promise<string>;
}

@Injectable()
export class TestingService {
  jwtService?: IJwtService;

  constructor(
    @InjectDataSource(CONNECTION_NAME) private dataSource: DataSource,
  ) {}

  findOne<T extends ObjectLiteral>(
    type: EntityTarget<T>,
  ): Repository<T>['findOne'] {
    const repository = this.dataSource.getRepository(type);
    return repository.findOne.bind(repository);
  }

  update<T extends ObjectLiteral>(
    type: EntityTarget<T>,
  ): Repository<T>['update'] {
    const repository = this.dataSource.getRepository(type);
    return repository.update.bind(repository);
  }

  delete<T extends ObjectLiteral>(
    type: EntityTarget<T>,
  ): Repository<T>['delete'] {
    const repository = this.dataSource.getRepository(type);
    return repository.delete.bind(repository);
  }

  count<T extends ObjectLiteral>(
    type: EntityTarget<T>,
  ): Repository<T>['count'] {
    const repository = this.dataSource.getRepository(type);
    return repository.count.bind(repository);
  }

  find<T extends ObjectLiteral>(type: EntityTarget<T>): Repository<T>['find'] {
    const repository = this.dataSource.getRepository(type);
    return repository.find.bind(repository);
  }

  async createHut(
    data: DeepPartial<Hut> = {},
    pointData: Partial<Point> = {
      position: {
        type: 'Point',
        coordinates: [randomInt(-170, 170), randomInt(-85, 85)],
      },
    },
  ): Promise<WithPoint<Hut>> {
    let pointId: ID | undefined = data?.pointId;

    if (!pointId) {
      const point = await this.createPoint(pointData);
      pointId = point.id;
    }

    const prettyPoint = await this.repo(Point).findOneByOrFail({ id: pointId });
    const hut = await this.createBase<Hut>(Hut, {
      ...mergeRight(
        {
          elevation: 100,
          email: 'test@hehe.xd',
          phoneNumber: '+393511234566',
          description: '',
        } as Partial<Hut>,
        data,
      ),
      pointId,
    });

    return { ...hut, point: prettyPoint };
  }

  async createParkingLot(
    data: DeepPartial<ParkingLot>,
    pointData: Partial<Point> = {
      position: {
        type: 'Point',
        coordinates: [randomInt(-170, 170), randomInt(-85, 85)],
      },
    },
  ): Promise<WithPoint<ParkingLot>> {
    let pointId: ID | undefined = data?.pointId;

    if (pointData || !pointId) {
      const point = await this.createPoint(pointData);
      pointId = point.id;
    }

    const prettyPoint = await this.repo(Point).findOneByOrFail({ id: pointId });

    const parkingLot = await this.createBase<ParkingLot>(ParkingLot, {
      ...mergeRight(
        {
          maxCars: 1,
          city: '',
          country: '',
          province: '',
          region: '',
        } as Partial<ParkingLot>,
        data,
      ),
      pointId,
    });

    return { ...parkingLot, point: prettyPoint };
  }

  async createHikePoint(
    data: DeepPartial<HikePoint> & Pick<HikePoint, HikePointPrimaryKey>,
  ): Promise<HikePoint> {
    return await this.createBase<HikePoint>(HikePoint, data);
  }

  async createPoint(data: DeepPartial<Point> = {}): Promise<Point> {
    const entity = await this.createBase<Point>(Point, data);

    return await this.repo(Point).findOneByOrFail({ id: entity.id });
  }

  async createHike(data: DeepPartial<Hike> = {}): Promise<Hike> {
    return await this.createBase<Hike>(Hike, data);
  }

  async createUserHike(data: DeepPartial<UserHike> = {}): Promise<UserHike> {
    return await this.createBase<UserHike>(UserHike, data);
  }

  async createUserHikeTrackPointWithPosition(
    data: Pick<UserHikeTrackPoint, 'userHikeId'> &
      DeepPartial<UserHikeTrackPoint>,
    _point?: Pick<Point, 'position'> & DeepPartial<Point>,
  ): Promise<UserHikeTrackPoint> {
    const insertAndReturn = async (data: DeepPartial<UserHikeTrackPoint>) => {
      const entry = await this.createBase<UserHikeTrackPoint>(
        UserHikeTrackPoint,
        data,
      );

      return this.repo(UserHikeTrackPoint).findOneByOrFail({
        index: entry.index,
        userHikeId: entry.userHikeId,
      });
    };

    if (!_point) {
      return await insertAndReturn(data);
    }

    const point = await this.createPoint({
      type: PointType.point,
      ..._point,
    });
    const userHike = await this.repo(UserHike).findOneByOrFail({
      id: data.userHikeId,
    });
    let index: number;

    if (isNotNil(data.index)) {
      index = data.index;
    } else {
      const lastRefPoint = await this.repo(HikePoint)
        .createQueryBuilder('hp')
        .innerJoin(
          UserHike,
          'uh',
          '(uh.hikeId = hp.hikeId and uh.id = :userHikeId)',
          { userHikeId: userHike.id },
        )
        .andWhere('hp.type = :type', { type: PointType.referencePoint })
        .orderBy('hp.index', 'DESC')
        .getOne();

      index = lastRefPoint ? lastRefPoint.index + 1 : 0;
    }

    // bind as to a hike reference point
    await this.createHikePoint({
      pointId: point.id,
      hikeId: userHike.hikeId,
      type: PointType.referencePoint,
      index,
    });

    return await insertAndReturn({ ...data, pointId: point.id });
  }

  async createUserHikeTrackPoint(
    data: DeepPartial<UserHikeTrackPoint> = {},
  ): Promise<UserHikeTrackPoint> {
    const entry = await this.createBase<UserHikeTrackPoint>(
      UserHikeTrackPoint,
      data,
    );

    return await this.repo(UserHikeTrackPoint).findOneByOrFail({
      index: entry.index,
      userHikeId: entry.userHikeId,
    });
  }

  async createUser(
    data: DeepPartial<User> = {},
  ): Promise<User & { token?: string }> {
    const password = Math.random().toString().slice(2);
    const email = `${Math.random().toString().slice(2)}@gmail.com`;

    const user = (await this.createBase(User, {
      firstName: 'test',
      lastName: 'test',
      role: UserRole.localGuide,
      email,
      password,
      verified: true,
      verificationHash: '123',
      ...data,
    })) as unknown as User;

    const token = this.jwtService
      ? await this.jwtService.signUserJwt(user)
      : undefined;

    return {
      ...user,
      token,
    };
  }

  async createBase<T extends ObjectLiteral>(
    type: EntityTarget<T>,
    data: DeepPartial<T> = {} as DeepPartial<T>,
  ): Promise<T> {
    return await this.dataSource.getRepository(type).save({
      ...data,
    });
  }

  async withPoint<T extends { pointId: ID }>(entity: T): Promise<WithPoint<T>> {
    const point = await this.repo(Point).findOneByOrFail({
      id: entity.pointId,
    });

    return { ...entity, point };
  }

  getConnection() {
    return this.dataSource;
  }

  getRepository<T extends ObjectLiteral>(t: EntityTarget<T>) {
    return this.dataSource.getRepository(t);
  }

  repo<T extends ObjectLiteral>(t: EntityTarget<T>) {
    return this.getRepository(t);
  }

  setJwtService<T extends IJwtService>(jwtService: T) {
    this.jwtService = jwtService;
  }
}
