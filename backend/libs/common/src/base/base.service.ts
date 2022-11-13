import { Type } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

import { ID } from '../types';

interface ConstructorOptions<T extends ObjectLiteral> {
  repository: Repository<T>;
  errorMessage: string;
}

const getTableName = <T extends ObjectLiteral>(
  repository: Repository<T>,
): string => repository.metadata.tableName;

export class BaseService<T extends { id: ID }> {
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
    data: DeepPartial<T>,
    entityManager?: EntityManager,
  ): Promise<T> {
    return this.getRepository(entityManager).save(data);
  }

  async findById(id: ID, entityManager?: EntityManager): Promise<T | null> {
    return this.getRepository(entityManager).findOneBy({
      id,
    } as FindOptionsWhere<T>);
  }

  async findByIdOrThrow(
    id: ID,
    entityManager?: EntityManager,
    errorMessage?: string,
  ): Promise<T> {
    const entity = await this.findById(id, entityManager);

    if (!entity) {
      throw new Error(errorMessage ?? this.errorMessage);
    }

    return entity;
  }

  async ensureExistsOrThrow(
    id: ID,
    entityManager?: EntityManager,
    errorMessage?: string,
  ): Promise<true> {
    const repository = this.getRepository(entityManager);

    const [{ exists }] = await repository.query(
      `SELECT EXISTS(SELECT 1 FROM public."${getTableName(
        repository,
      )}" WHERE "id" = $1)`,
      [id],
    );

    if (!exists) {
      throw new Error(errorMessage ?? this.errorMessage);
    }

    return true;
  }

  getRepository(entityManager?: EntityManager): Repository<T> {
    return entityManager
      ? entityManager.getRepository(this.type)
      : this.repository;
  }
}
