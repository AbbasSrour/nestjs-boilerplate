import './boilerplate.polyfill';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { config } from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(config)],
  providers: [],
})
export class AppModule {}
