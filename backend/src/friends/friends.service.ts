import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeHike } from '@app/common/entities/code-hike.entity';
import { Injectable } from '@nestjs/common/decorators';
import { UserHike, Point } from '@app/common';
import { randomBytes } from 'crypto';
import { UserHikesService } from '@core/user-hikes/user-hikes.service';
import { HttpException } from '@nestjs/common/exceptions';
import { UserHikeFull } from '@core/user-hikes/user-hikes.interface';
import { UserHikeReference } from '@app/common';


@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(CodeHike)
    private codeHikeRepository: Repository<CodeHike>,
    @InjectRepository(UserHike)
    private userHikeRepository: Repository<UserHike>,
    private userHikeService: UserHikesService,
    @InjectRepository(UserHikeReference)
    private userHikeReference: Repository<UserHikeReference>,
  ) {}

  async shareLink(userId: number): Promise<Object> {

    const userHike = await this.userHikeRepository
    .createQueryBuilder('uh')
    .where('uh.userId = :userId', {userId})
    .andWhere('uh.finishedAt IS NULL')
    .getOne()

    if(userHike === null) throw new HttpException("Hike not found",422);

    const existingHike = await this.codeHikeRepository.findOneBy({userHikeId: userHike.id})
    if(existingHike !== null) 
        return {Code: existingHike.code}

    const randomCode = randomBytes(2).toString('hex');
    const existingCode = await this.codeHikeRepository.findOneBy({code: randomCode})
    if(existingCode !== null) {
        const newCode = async () => {
            const randomCode = randomBytes(2).toString('hex');
            const existingCode = await this.codeHikeRepository.findOneBy({code: randomCode})
            if(existingCode !== null)
                newCode();
            else {
              await this.codeHikeRepository.save({
                code: randomCode,
                userHikeId: userHike?.id
            })
            return {Code: randomCode}
            }
        }
        newCode();
    }
    
    await this.codeHikeRepository.save({
      code: randomCode,
      userHikeId: userHike?.id
    })

    return {Code: randomCode}
  }

  async getFriendHike(code: string): Promise<UserHikeFull> {

    const userHike = await this.codeHikeRepository.findOneBy({code});
    if(userHike === null) throw new HttpException("Hike not found",422);

    const hike = await this.userHikeService.getFullUserHike(userHike.userHikeId);
    if(hike.finishedAt !== null) throw new HttpException("Hike terminated",422);

    return hike;
  }

  async getFriendReachedReferencePoints(code: string): Promise<UserHikeReference[]>{
    const userHike = await this.codeHikeRepository.findOneBy({code});
    if(userHike === null) throw new HttpException("Hike not found",422);

    const hike = await this.userHikeService.getFullUserHike(userHike.userHikeId);
    if(hike.finishedAt !== null) throw new HttpException("Hike terminated",422);

    const reachedPoints = await this.userHikeReference
    .createQueryBuilder('uf')
    .where('uf.userHikeId = :id', {id: userHike.userHikeId})
    .innerJoinAndMapOne('uf.pointId', Point, 'p', 'p.id = uf."pointId"')
    .getMany()

    return reachedPoints;  
  }



}