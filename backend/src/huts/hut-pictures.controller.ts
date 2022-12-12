import * as path from 'path';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { remove } from 'fs-extra';
import { difference } from 'ramda';

import {
  LocalGuideAndHutWorkerOnly,
  ID,
  CurrentUser,
  UserContext,
  Hut,
  IMAGES_URI,
  IMAGES_UPLOAD_PATH,
} from '@app/common';

import { HutPicturesReorderDto } from './huts.dto';
import { HutsService } from './huts.service';

@Controller('hut-pictures')
export class HutPicturesController {
  constructor(private hutsService: HutsService) {}

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('pictures', 20))
  @LocalGuideAndHutWorkerOnly()
  async upload(
    @Param('id', ParseIntPipe) id: ID,
    @CurrentUser() user: UserContext,
    @UploadedFiles()
    files: Express.Multer.File[],
  ): Promise<Hut> {
    const hut = await this.hutsService.findByIdOrThrow(id);

    const newPictures = files.map(({ filename }) =>
      [IMAGES_URI, filename].join('/'),
    );

    return await this.hutsService
      .getRepository()
      .save({ id, pictures: [...hut.pictures, ...newPictures] });
  }

  @Post(':id/modify')
  @HttpCode(HttpStatus.OK)
  @LocalGuideAndHutWorkerOnly()
  async reorder(
    @Param('id', ParseIntPipe) id: ID,
    @Body() { pictures }: HutPicturesReorderDto,
  ): Promise<Hut> {
    const { pictures: existingPictures } =
      await this.hutsService.findByIdOrThrow(id);

    // maybe delete some
    const deletedPictures = difference(existingPictures, pictures);

    // delete them
    for (const picture of deletedPictures) {
      const fileName = path.basename(picture);

      // delete
      await remove(path.join(IMAGES_UPLOAD_PATH, fileName));
    }

    await this.hutsService.getRepository().update({ id }, { pictures });

    return await this.hutsService.findByIdOrThrow(id);
  }
}
