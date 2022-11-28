import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@core/auth/jwt-auth.guard';

export const AuthenticatedOnly = () => UseGuards(JwtAuthGuard);
