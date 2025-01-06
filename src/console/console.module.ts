import { Module } from '@nestjs/common';

import { UserModule } from '../module/user/user.module';
import { CreateUserCommand } from './services/create-user.service';

@Module({
  imports: [UserModule],
  providers: [CreateUserCommand],
  exports: [],
})
export class ConsoleModule {}
