import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type {
  DataSource,
  DeepPartial,
  EntityTarget,
  Repository,
} from 'typeorm';

import {
  Hike,
  HikePoint,
  HikePointPrimaryKey,
  Hut,
  ID,
  ParkingLot,
  Point,
  User,
  UserRole,
} from '@app/common';

import { ParkingLotDto } from '@core/parking_lot/parking_lot.dto';

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

  findOne<T>(type: EntityTarget<T>): Repository<T>['findOne'] {
    const repository = this.dataSource.getRepository(type);
    return repository.findOne.bind(repository);
  }

  update<T>(type: EntityTarget<T>): Repository<T>['update'] {
    const repository = this.dataSource.getRepository(type);
    return repository.update.bind(repository);
  }

  delete<T>(type: EntityTarget<T>): Repository<T>['delete'] {
    const repository = this.dataSource.getRepository(type);
    return repository.delete.bind(repository);
  }

  count<T>(type: EntityTarget<T>): Repository<T>['count'] {
    const repository = this.dataSource.getRepository(type);
    return repository.count.bind(repository);
  }

  find<T>(type: EntityTarget<T>): Repository<T>['find'] {
    const repository = this.dataSource.getRepository(type);
    return repository.find.bind(repository);
  }

  // async getToken(user: User): Promise<string> {
  //   if (!this.authService) {
  //     throw new Error('Cannot resolve AuthService');
  //   }

  //   const authData = await this.authService.authenticate(user);

  //   return authData.token;
  // }

  async createHut(
    data?: DeepPartial<Hut>,
    pointData: Partial<Point> = {
      position: { type: 'Point', coordinates: [49, 7] },
    },
  ): Promise<Hut> {
    let pointId: ID | undefined = data?.pointId;

    if (pointData || !pointId) {
      const point = await this.createPoint(pointData);
      pointId = point.id;
    }

    const hut = await this.createBase<Hut>(Hut, { ...data, pointId });

    return hut;
  }

  async createParkingLot(
    data: DeepPartial<ParkingLotDto>,
    pointData: Partial<Point> = {
      position: { type: 'Point', coordinates: [49, 7] },
    },
  ): Promise<ParkingLot> {
    let pointId: ID | undefined = data?.pointId;

    if (pointData || !pointId) {
      const point = await this.createPoint(pointData);
      pointId = point.id;
    }

    return await this.createBase<ParkingLot>(ParkingLot, { ...data, pointId });
  }

  async createHikePoint(
    data: DeepPartial<HikePoint> & Pick<HikePoint, HikePointPrimaryKey>,
  ): Promise<HikePoint> {
    return await this.createBase<HikePoint>(HikePoint, data);
  }

  async createPoint(data: DeepPartial<Point> = {}): Promise<Point> {
    return await this.createBase(Point, data);
  }

  async createHike(data: DeepPartial<Hike> = {}): Promise<Hike> {
    return await this.createBase(Hike, data);
  }

  async createUser(
    data: DeepPartial<User> = {},
  ): Promise<User & { token?: string }> {
    // todo: generate token for future auth
    const password = Math.random().toString().slice(2);
    const email = `${Math.random().toString().slice(2)}@gmail.com`;

    const user = (await this.createBase(User, {
      firstName: 'test',
      lastName: 'test',
      role: UserRole.localGuide,
      email,
      password,
      verified: true,
      verificationHash: "123",
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

  async createBase<T>(
    type: EntityTarget<T>,
    data: DeepPartial<T> = {} as DeepPartial<T>,
  ): Promise<T> {
    return await this.dataSource.getRepository(type).save({
      ...data,
    });
  }

  getConnection() {
    return this.dataSource;
  }

  getRepository<T>(t: EntityTarget<T>) {
    return this.dataSource.getRepository(t);
  }

  repo<T>(t: EntityTarget<T>) {
    return this.getRepository(t);
  }

  setJwtService<T extends IJwtService>(jwtService: T) {
    this.jwtService = jwtService;
  }
}
