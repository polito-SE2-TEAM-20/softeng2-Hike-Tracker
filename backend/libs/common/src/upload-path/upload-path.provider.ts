/* istanbul ignore file */
import { FactoryProvider } from '@nestjs/common';

import { UPLOAD_PATH, UPLOAD_PATH_VALUE } from '../constants';

export const UploadPathProvider: FactoryProvider = {
  provide: UPLOAD_PATH_VALUE,
  useFactory: () => UPLOAD_PATH,
};
