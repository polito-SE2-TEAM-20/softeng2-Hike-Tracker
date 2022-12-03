import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';

import { JwtAuthGuard } from '@core/auth/jwt-auth.guard';

import { UserRole } from '../enums';
import { RolesGuard } from '../guards';

/**
 * Specify roles that are allowed to access this route
 * @param roles Route list
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

const createRoleDecorator = (...roles: UserRole[]) =>
  applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard));

export const RolesOnly = (...roles: UserRole[]) =>
  applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard));

export const HikerOnly = () => createRoleDecorator(UserRole.hiker);

export const LocalGuideOnly = () => createRoleDecorator(UserRole.localGuide);

export const HutWorkerOnly = () => createRoleDecorator(UserRole.hutWorker);

export const LocalGuideAndHutWorkerOnly = () =>
  createRoleDecorator(UserRole.localGuide, UserRole.hutWorker);

export const PlatformManagerOnly = () =>
  createRoleDecorator(UserRole.platformManager);
