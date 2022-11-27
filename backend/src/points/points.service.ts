import { Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { BaseService, ID, Point } from '@app/common';

export class PointsService extends BaseService<Point> {
  constructor(
    @InjectRepository(Point)
    private pointsRepository: Repository<Point>,
  ) {
    super(Point, {
      repository: pointsRepository,
      errorMessage: 'Point not found',
    });
  }

  baseQuery(alias = 'p', entityManager?: EntityManager) {
    return this.getRepository(entityManager).createQueryBuilder(alias);
  }

  getPointFromJoined(
    query: SelectQueryBuilder<Point>,
    entity: Type,
    alias: string,
    entityId: ID,
  ): typeof query {
    return query.andWhere((qb) => {
      const subQuery = qb
        .subQuery()
        .select([`${alias}.pointId`])
        .from(entity, alias)
        .andWhere(`${alias}.id = :entityId`, {
          entityId,
        })
        .getQuery();

      return `${query.alias}.id IN ${subQuery}`;
    });
  }
}
