import { resolve } from 'path';

import { applyDecorators } from '@nestjs/common';
import { IsInt, Min, ValidationOptions } from 'class-validator';

import { PerformanceStat } from '../enums';

export const ROOT = resolve(process.cwd());

export const SERVE_FOLDER = resolve(process.cwd(), './uploads');

export const IMAGES_UPLOAD_PATH = resolve(process.cwd(), './uploads/images');
export const IMAGES_UPLOAD_PATH_VALUE = Symbol('IMAGES_UPLOAD_PATH_VALUE');

export const UPLOAD_PATH = resolve(process.cwd(), './uploads/gpx');
export const UPLOAD_PATH_VALUE = Symbol('UPLOAD_PATH_VALUE');

export const STATIC_PREFIX = 'static';

export const GPX_FILE_URI = `/${STATIC_PREFIX}/gpx`;
export const IMAGES_URI = `/${STATIC_PREFIX}/images`;

export const FRONTEND_HOST = 'hiking.germangorodnev.com';

export const IsIdentifier = (options?: ValidationOptions) =>
  applyDecorators(IsInt(options), Min(1, options));

export const PerformanceStatUnits: Record<PerformanceStat, string> = {
  averagePace: 'min/km',
  averageVerticalAscentSpeed: 'm/h',
  fastestPace: 'min/km',
  highestAltitudeReached: 'm',
  largestAltitudeRange: 'm',
  longestHikeDistanceKms: 'km',
  longestHikeTimeHours: 'h',
  shortestHikeDistanceKms: 'km',
  shortestHikeTimeHours: 'h',
  totalHikesFinished: 'hike',
  totalKmsWalked: 'km',
};
