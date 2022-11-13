import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService, Point } from '@app/common';

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
}
