import { extname } from 'path';

import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

import { IMAGES_UPLOAD_PATH, UPLOAD_PATH } from '@app/common';

export const uploadStorage = diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname.includes('picture')) {
      return cb(null, IMAGES_UPLOAD_PATH);
    }

    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => cb(null, uuid() + extname(file.originalname)),
});

export const imagesUploadStorage = diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_UPLOAD_PATH),
  filename: (req, file, cb) => cb(null, uuid() + extname(file.originalname)),
});
