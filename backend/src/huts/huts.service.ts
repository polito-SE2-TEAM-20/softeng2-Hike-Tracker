import { InjectRepository } from '@nestjs/typeorm';
import { propEq } from 'ramda';
import { EntityManager, In, Repository } from 'typeorm';

import { BaseService, Hut, ID, orderEntities } from '@app/common';

export class HutsService extends BaseService<Hut> {
  constructor(
    @InjectRepository(Hut)
    private hutsRepository: Repository<Hut>,
  ) {
    super(Hut, {
      repository: hutsRepository,
      errorMessage: 'Hut not found',
    });
  }

  /**
   * Get huts with points joined
   */
  async getFullByIds(ids: ID[], entityManager?: EntityManager) {
    const huts = await this.getRepository(entityManager).find({
      where: { id: In(ids) },
      loadEagerRelations: true,
    });

    orderEntities(huts, ids, propEq('id'));
  }
}
