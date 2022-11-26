import { Transform } from 'class-transformer';

import { transformToClass } from '@app/common';

import { StartEndPointDto } from './hikes.dto';

export const StartEndPointTransformer = () =>
  Transform(
    ({ value }) => {
      if (typeof value !== 'string') {
        return value;
      }

      return transformToClass(StartEndPointDto, JSON.parse(value));
    },
    { toClassOnly: true },
  );
