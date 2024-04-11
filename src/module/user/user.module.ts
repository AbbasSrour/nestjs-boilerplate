import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { CreateSettingsHandler } from './command/create-settings.command';
import { UserEntity } from './entity/user.entity';
import { UserSettingsEntity } from './entity/user-settings.entity';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';

const handlers = [CreateSettingsHandler];

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, UserSettingsEntity])],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, ...handlers],
})
export class UserModule {}
