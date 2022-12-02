import { Type } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

interface ConstructorOptions<T extends ObjectLiteral> {
  repository: Repository<T>;
  errorMessage: string;
}

export class BaseCompositeKeyService<
  T extends ObjectLiteral,
  PKey extends keyof T,
> {
  private type: Type<T>;
  private repository: Repository<T>;
  protected errorMessage: string;

  constructor(
    type: Type<T>,
    { repository, errorMessage }: ConstructorOptions<T>,
  ) {
    this.type = type;
    this.repository = repository;
    this.errorMessage = errorMessage;
  }

  async create(
    data: DeepPartial<T> & Pick<T, PKey>,
    entityManager?: EntityManager,
  ): Promise<T> {
    return await this.getRepository(entityManager).save(data);
  }

  async findOne(
    query: FindOneOptions<T>,
    entityManager?: EntityManager,
  ): Promise<T | null> {
    return this.getRepository(entityManager).findOne(query);
  }

  async findOneBy(
    query: (FindOptionsWhere<T> & Pick<T, PKey>) | FindOptionsWhere<T>[],
    entityManager?: EntityManager,
  ): Promise<T | null> {
    return this.getRepository(entityManager).findOneBy(query);
  }

  async findOneOrThrow(
    query: FindOptionsWhere<T> & Pick<T, PKey>,
    entityManager?: EntityManager,
  ): Promise<T> {
    const entity = await this.findOneBy(query, entityManager);

    if (!entity) {
      throw new Error(this.errorMessage);
    }

    return entity;
  }

  getRepository(entityManager?: EntityManager): Repository<T> {
    return entityManager
      ? entityManager.getRepository(this.type)
      : this.repository;
  }
}
