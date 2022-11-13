import { join, resolve } from 'path';

export const ROOT = resolve(process.cwd());

export const UPLOAD_PATH = resolve(process.cwd(), './uploads/gpx');
export const UPLOAD_PATH_VALUE = Symbol('UPLOAD_PATH_VALUE');

export const STATIC_PREFIX = 'static';

export const GPX_FILE_PATH = join(`/${STATIC_PREFIX}`, 'gpx');

export const FRONTEND_HOST = 'hiking.germangorodnev.com';
