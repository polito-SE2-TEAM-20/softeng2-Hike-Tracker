import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeHike } from '@app/common/entities/code-hike.entity';
import { Injectable } from '@nestjs/common/decorators';
import { UserHike } from '@app/common';
import { randomBytes } from 'crypto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(CodeHike)
    private codeHikeRepository: Repository<CodeHike>,
    @InjectRepository(UserHike)
    private userHikeRepositoty: Repository<UserHike>
  ) {}

  async shareLink(userId: number): Promise<string> {

    const randomCode = randomBytes(2).toString('hex');
    const userHike = await this.userHikeRepositoty
    .createQueryBuilder('uh')
    .where('uh.userId = :userId', {userId})
    .andWhere('uh.finishedAt IS NULL')
    .getOne()

    await this.codeHikeRepository.save({
        code: randomCode,
        userHikeId: userHike?.id,
        link: "link di prova"
    })

    return randomCode
  }




}