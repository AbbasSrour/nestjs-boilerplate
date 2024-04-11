import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CreateSettingsHandler } from './command/create-settings.command.ts';
import { UserEntity } from './entity/user.entity.ts';
import { UserSettingsEntity } from './entity/user-settings.entity.ts';
import { UserSubscriber } from './subscriber/user.subscriber.ts';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const handlers = [CreateSettingsHandler];

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, UserSettingsEntity])],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserSubscriber, ...handlers],
})
export class UserModule {}
