import { InjectRepository } from '@nestjs/typeorm';
import { propEq } from 'ramda';
import { EntityManager, In, Repository } from 'typeorm';

import {
  BaseService,
  GPoint,
  Hut,
  ID,
  orderEntities,
  Point,
  PointType,
  UserContext,
} from '@app/common';

import { CreateHutDto } from './huts.dto';

export class HutsService extends BaseService<Hut> {
  constructor(
    @InjectRepository(Hut)
    private hutsRepository: Repository<Hut>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {
    super(Hut, {
      repository: hutsRepository,
      errorMessage: 'Hut not found',
    });
  }

  /**
   * Get huts with points joined
   */
  async getFullByIds(ids: ID[], entityManager?: EntityManager): Promise<Hut[]> {
    const huts = await this.getRepository(entityManager).find({
      where: { id: In(ids) },
      loadEagerRelations: true,
    });

    orderEntities(huts, ids, propEq('id'));
    return huts;
  }

  async getFullHut(id: ID, entityManager?: EntityManager): Promise<Hut> {
    return await this.findByIdOrThrow(id, entityManager);
  }

  async validatePermissions(hut: Hut, user: UserContext): Promise<void> {
    if (hut.userId !== user.id) {
      throw new Error('Permissions error');
    }
  }

  /**
   * Create a new hut
   */
  async createNewHut(
    { location, ...data }: CreateHutDto,
    userId: number,
  ): Promise<Hut> {
    if (!location) {
      throw new Error('Location is required');
    }

    //Create hut point
    const position: GPoint = {
      type: 'Point',
      coordinates: [location.lon, location.lat],
    };

    const point = await this.pointRepository.save({
      type: PointType.hut,
      position,
      address: location.address,
      name: location.name,
    });

    //Create a new hut in the DB
    const hut = await this.hutsRepository.save({
      userId,
      pointId: point.id,
      ...data,
    });

    //Return created hut
    return hut;
  }
}
