/* istanbul ignore file */
import { FactoryProvider } from '@nestjs/common';

import {
  IMAGES_UPLOAD_PATH,
  IMAGES_UPLOAD_PATH_VALUE,
  UPLOAD_PATH,
  UPLOAD_PATH_VALUE,
} from '../constants';

export const UploadPathProvider: FactoryProvider = {
  provide: UPLOAD_PATH_VALUE,
  useFactory: () => UPLOAD_PATH,
};

export const ImagesUploadPathProvider: FactoryProvider = {
  provide: IMAGES_UPLOAD_PATH_VALUE,
  useFactory: () => IMAGES_UPLOAD_PATH,
};
