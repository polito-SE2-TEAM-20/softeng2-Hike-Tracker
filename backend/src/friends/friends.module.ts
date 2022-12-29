import { UserHike } from '@app/common';
import { CodeHike } from '@app/common/entities/code-hike.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';


@Module({
  imports: [TypeOrmModule.forFeature([CodeHike, UserHike])],
  providers: [FriendsService],
  controllers: [FriendsController],
  exports: [FriendsService],
})
export class FriendsModule {}