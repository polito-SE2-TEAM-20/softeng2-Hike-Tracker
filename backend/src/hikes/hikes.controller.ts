import { Body, Controller, Get, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Hike } from '@app/common';

@Controller('hikes')
export class HikesController {
  constructor(private dataSource: DataSource) {}

  @Get()
  async getHikes(): Promise<Hike[]> {
    return await this.dataSource.getRepository(Hike).findBy({});
  }

  @Post("/filteredHikes")
  async getFilteredHikes(@Body() body: any): Promise<Hike[]> {
     let hikes = await this.dataSource.getRepository(Hike)
                .createQueryBuilder('hikes')
                .where(body.province !== null 
                  ? 'hikes.province = :province'
                  : 'TRUE', { province: body.province })
                .andWhere(body.region !== null 
                  ? 'hikes.region = :region'
                  : 'TRUE', { region: body.region })
                .andWhere(body.maxLength !== null 
                  ? 'hikes.length <= :maxLength'
                  : 'TRUE', { maxLength: body.maxLength })
                .andWhere(body.minLength !== null 
                  ? 'hikes.length >= :minLength'
                  : 'TRUE', { minLength: body.minLength })
                .andWhere(body.difficultyMax !== null 
                  ? 'hikes.difficulty <= :maxDifficulty'
                  : 'TRUE', { maxDifficulty: body.difficultyMax })
                .andWhere(body.difficultyMin !== null 
                  ? 'hikes.difficulty >= :difficultyMin'
                  : 'TRUE', { difficultyMin: body.difficultyMin }) //ok
                .andWhere(body.expectedTimeMax !== null 
                  ? 'hikes.length <= :expectedTimeMax'
                  : 'TRUE', { expectedTimeMax: body.expectedTimeMax })
                .andWhere(body.expectedTimeMin !== null 
                  ? 'hikes.expectedTime >= :expectedTimeMin'
                  : 'TRUE', { expectedTimeMin: body.expectedTimeMin }) //ok
                .andWhere(body.ascentMax !== null 
                  ? 'hikes.ascent <= :ascentMax'
                  : 'TRUE', { ascentMax: body.ascentMax })
                .andWhere(body.ascentMin !== null 
                  ? 'hikes.ascent >= :ascentMin'
                  : 'TRUE', { ascentMin: body.ascentMin })
                .getMany();
    console.log(hikes); 
    return hikes;
  }
}
