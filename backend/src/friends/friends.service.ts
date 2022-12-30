import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeHike } from '@app/common/entities/code-hike.entity';
import { Injectable } from '@nestjs/common/decorators';
import { UserHike } from '@app/common';
import { randomBytes } from 'crypto';
import { UserHikesService } from '@core/user-hikes/user-hikes.service';
import { HttpException } from '@nestjs/common/exceptions';
import { UserHikeFull } from '@core/user-hikes/user-hikes.interface';


@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(CodeHike)
    private codeHikeRepository: Repository<CodeHike>,
    @InjectRepository(UserHike)
    private userHikeRepositoty: Repository<UserHike>,
    private userHikeService: UserHikesService
  ) {}

  async shareLink(userId: number): Promise<Object> {

    const userHike = await this.userHikeRepositoty
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



}