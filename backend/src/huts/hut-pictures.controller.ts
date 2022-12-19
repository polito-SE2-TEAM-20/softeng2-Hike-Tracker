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

import {
  LocalGuideAndHutWorkerOnly,
  ID,
  CurrentUser,
  UserContext,
  Hut,
} from '@app/common';
import { PicturesService } from '@core/pictures/pictures.service';

import { HutPicturesReorderDto } from './huts.dto';
import { HutsService } from './huts.service';

@Controller('hut-pictures')
export class HutPicturesController {
  constructor(
    private hutsService: HutsService,
    private picturesService: PicturesService,
  ) {}

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

    const newPictures = this.picturesService.prepareFilePaths(files);

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

    const newPictures =
      await this.picturesService.getPicturesListAndDeleteRemoved(
        pictures,
        existingPictures,
      );

    await this.hutsService
      .getRepository()
      .update({ id }, { pictures: newPictures });

    return await this.hutsService.findByIdOrThrow(id);
  }
}
