import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { concat } from 'ramda';

import {
  ID,
  CurrentUser,
  UserContext,
  LocalGuideOnly,
  Hike,
  ParseIdPipe,
  HikeLimits,
} from '@app/common';
import { PicturesService } from '@core/pictures/pictures.service';

import { HikesService } from './hikes.service';

@Controller('hike-pictures')
export class HikePicturesController {
  constructor(
    private hikesService: HikesService,
    private picturesService: PicturesService,
  ) {}

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('pictures', HikeLimits.maxPictures))
  @LocalGuideOnly()
  async upload(
    @Param('id', ParseIdPipe()) id: ID,
    @CurrentUser() user: UserContext,
    @UploadedFiles()
    files: Express.Multer.File[],
  ): Promise<Hike> {
    const hike = await this.hikesService.findByIdOrThrow(id);

    const newPictures = this.picturesService.prepareFilePaths(files);

    return await this.hikesService
      .getRepository()
      .save({ id, pictures: concat(hike.pictures, newPictures) });
  }
}
