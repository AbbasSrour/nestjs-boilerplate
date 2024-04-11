import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  type NestExpressApplication,
} from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/bad-request.filter';
import { SyntaxErrorFilter } from './filter/syntax-error.filter';
import { TranslationInterceptor } from './interceptor/translation-interceptor.service';
import { TranslationService } from './module/shared/services/translation.service';
import { SharedModule } from './module/shared/shared.module';

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  // Security
  app.enable('trust proxy');
  app.use(helmet());

  app.setGlobalPrefix('/api');
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new SyntaxErrorFilter(reflector),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TranslationInterceptor(
      app.select(SharedModule).get(TranslationService),
    ),
  );

  return app;
}

// eslint-disable-next-line
void bootstrap();
