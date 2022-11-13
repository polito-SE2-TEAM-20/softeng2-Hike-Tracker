import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserJwtPayload } from '../types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserJwtPayload => {
    return ctx.switchToHttp().getRequest().user;
  },
);
