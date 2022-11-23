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
  User,
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
  async getFullByIds(ids: ID[], entityManager?: EntityManager) {
    const huts = await this.getRepository(entityManager).find({
      where: { id: In(ids) },
      loadEagerRelations: true,
    });

    orderEntities(huts, ids, propEq('id'));
  }

  async validatePermissions(hut: Hut, user: User): Promise<void> {
    if (hut.userId !== user.id) {
      throw new Error('Permissions error');
    }
  }

  /**
   * Create a new hut
   */
  async createNewHut({ ...data }: CreateHutDto, userId: number): Promise<Hut> {
    //Create hut point
    const position: GPoint = {
      type: 'Point',
      coordinates: [data.location!.lon, data.location!.lat],
    };

    const point = await this.pointRepository.save({
      type: PointType.hut,
      position,
      address: data.location?.address,
      name: data.location?.name,
    });

    //Create a new hut in the DB
    const hut = await this.hutsRepository.save({
      userId,
      title: data.title,
      pointId: point.id,
      numberOfBeds: data.numberOfBeds,
      price: data.price,
    });

    //Return created hut
    return hut;
  }
}
