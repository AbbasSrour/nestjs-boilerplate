import './boilerplate.polyfill';

import path from 'node:path';

import { MikroORM } from '@mikro-orm/core';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import type {
  MiddlewareConsumer,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

// import { ConsoleModule } from './console/console.module';
import { AuthModule } from '@module/auth/auth.module';
import { PostModule } from '@module/post/post.module';
import { UserModule } from '@module/user/user.module';
import { HealthCheckerModule } from '@package/health-checker/health-checker.module';
import { ApiConfigService } from '@package/shared/services/api-config.service';
import { SharedModule } from '@package/shared/shared.module';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => configService.mikroOrm,
      inject: [ApiConfigService],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        throttlers: [configService.throttlerConfigs],
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, 'i18n/'),
          watch: configService.isDevelopment,
        },
        typesOutputPath: path.join(__dirname, './generated/i18n.generated'),
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    // ConsoleModule,
    AuthModule,
    UserModule,
    PostModule,
    HealthCheckerModule,
  ],
  providers: [],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    // await this.orm.getMigrator().up();
  }

  // For some reason, the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM.
  // By registering the middleware directly in AppModule, we can get around this issue.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
