import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import type { RoleType } from '../constant/role-type';
import { AuthGuard } from '../guard/auth.guard.ts';
import { RolesGuard } from '../guard/roles.guard.ts';
import { AuthUserInterceptor } from '../interceptor/auth-user-interceptor.service';
import { PublicRoute } from './public-route.decorator';
import { Roles } from './roles.decorator';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    Roles(roles),
    UseGuards(AuthGuard({ public: isPublicRoute }), RolesGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
}
