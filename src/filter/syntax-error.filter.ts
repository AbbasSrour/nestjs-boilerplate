import { STATUS_CODES } from 'node:http';

import { SyntaxErrorException } from '@mikro-orm/core';
import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Response } from 'express';

import { constraintErrors } from '../constants/constraint-errors';

@Catch(SyntaxErrorException)
export class SyntaxErrorFilter
  implements ExceptionFilter<SyntaxErrorException>
{
  constructor(public reflector: Reflector) {}

  catch(
    exception: SyntaxErrorException & { constraint?: string },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.constraint?.startsWith('UQ')
      ? HttpStatus.CONFLICT
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message: exception.constraint
        ? constraintErrors[exception.constraint]
        : undefined,
    });
  }
}
