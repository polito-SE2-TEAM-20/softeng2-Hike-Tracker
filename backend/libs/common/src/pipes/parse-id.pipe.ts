import { ParseIntPipe, ParseIntPipeOptions } from '@nestjs/common';

export const ParseIdPipe = (options?: ParseIntPipeOptions) =>
  new ParseIntPipe(options);
