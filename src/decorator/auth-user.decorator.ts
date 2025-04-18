import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

export function AuthUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    const user = 'user' in request ? request.user : undefined;

    if (user?.[Symbol.for('isPublic')]) {
      return;
    }

    return user;
  })();
}
