import * as path from 'path';

import { Inject, Injectable } from '@nestjs/common';
import { remove } from 'fs-extra';
import { compose, difference, map, prop } from 'ramda';

import { getImagePath, IMAGES_UPLOAD_PATH_VALUE } from '@app/common';

@Injectable()
export class PicturesService {
  constructor(@Inject(IMAGES_UPLOAD_PATH_VALUE) private imagesPath: string) {}

  prepareFilePaths(files: Express.Multer.File[]): string[] {
    return map(compose(getImagePath, prop('filename')), files);
  }

  async getPicturesListAndDeleteRemoved(
    pictures: string[],
    existingPictures: string[],
  ): Promise<string[]> {
    const deletedPictures = difference(existingPictures, pictures);
    await Promise.all(
      deletedPictures.map((picture) =>
        remove(path.join(this.imagesPath, path.basename(picture))),
      ),
    );

    return pictures;
  }
}
