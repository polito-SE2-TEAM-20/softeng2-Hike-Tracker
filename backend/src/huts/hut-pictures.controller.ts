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
  IMAGES_URI,
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

  @Post(':id/reorder')
  @HttpCode(HttpStatus.OK)
  @LocalGuideAndHutWorkerOnly()
  async reorder(
    @Param('id', ParseIntPipe) id: ID,
    @Body() { pictures }: HutPicturesReorderDto,
  ): Promise<Hut> {
    await this.hutsService.ensureExistsOrThrow(id);

    await this.hutsService.getRepository().update({ id }, { pictures });

    return await this.hutsService.findByIdOrThrow(id);
  }
}
