import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export function AuthUser() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user;

    if (user?.[Symbol.for('isPublic')]) {
      return;
    }

    return user;
  })();
}
