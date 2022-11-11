import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export const AuthenticatedOnly = () => UseGuards(JwtAuthGuard);
