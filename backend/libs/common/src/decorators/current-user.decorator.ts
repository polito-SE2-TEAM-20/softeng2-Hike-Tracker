import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserContext } from '../types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserContext => {
    return ctx.switchToHttp().getRequest().user;
  },
);
