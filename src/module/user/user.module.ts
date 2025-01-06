import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CreateSettingsHandler } from './command/create-settings.command';
import { UserEntity } from './entity/user.entity';
import { UserSettingsEntity } from './entity/user-settings.entity';
import { UserSubscriber } from './subscriber/user.subscriber';
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
