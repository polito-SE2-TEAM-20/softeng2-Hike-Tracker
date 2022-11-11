import { resolve } from 'path';

export const UPLOAD_PATH = resolve(process.cwd(), './uploads');
export const UPLOAD_PATH_VALUE = Symbol('UPLOAD_PATH_VALUE');
