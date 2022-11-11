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
    const query = this.dataSource.getRepository(Hike).createQueryBuilder('hikes');
                
    if(body.region !== null) 
      query.where('hikes.region = :region', { region: body.region })
    if(body.province !== null) 
      query.andWhere('hikes.province = :province', { province: body.province })
    if(body.maxLength !== null) 
      query.andWhere('hikes.length <= :maxLength', { maxLength: body.maxLength })
    if(body.minLength !== null) 
      query.andWhere('hikes.length >= :minLength', { minLength: body.minLength })
    if(body.difficultyMax !== null) 
      query.andWhere('hikes.difficulty <= :maxDifficulty', { maxDifficulty: body.difficultyMax })
    if(body.difficultyMin !== null) 
      query.andWhere('hikes.difficulty >= :difficultyMin', { difficultyMin: body.difficultyMin })
    if(body.expectedTimeMax !== null) 
      query.andWhere('hikes.length <= :expectedTimeMax', { expectedTimeMax: body.expectedTimeMax })
    if(body.expectedTimeMin !== null) 
      query.andWhere('hikes.expectedTime >= :expectedTimeMin', { expectedTimeMin: body.expectedTimeMin })
    if(body.ascentMax !== null) 
      query.andWhere('hikes.ascent <= :ascentMax', { ascentMax: body.ascentMax })
    if(body.ascentMin !== null) 
      query.andWhere('hikes.ascent >= :ascentMin', { ascentMin: body.ascentMin })
                
    let hikes = await query.getMany();
    console.log(hikes); 
    return hikes;
  }
}
