import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable, UseInterceptors } from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';

import { LanguageCode } from '@constant/language-code';
import { ContextProvider } from '@provider/context.provider';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<undefined> {
    const request = context.switchToHttp().getRequest<Request>();
    const language = request.headers['x-language-code'];

    if (language && typeof language === 'string' && LanguageCode[language]) {
      ContextProvider.setLanguage(language);
    }

    return next.handle();
  }
}

export function UseLanguageInterceptor() {
  return UseInterceptors(LanguageInterceptor);
}
