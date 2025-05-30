import { Entity, OneToOne, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@abstract/entity/abstract.entity';
import { UseDto } from '@decorator/use-dto.decorator';
import type { Type } from '@nestjs/common';
import {
  UserSettingsDto,
  type UserSettingsDtoOptions,
} from '../dto/user-settings.dto';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'user_settings' })
@UseDto(() => UserSettingsDto)
export class UserSettingsEntity extends AbstractEntity<
  UserSettingsDto,
  UserSettingsDtoOptions
> {
  @Property({ default: false })
  isEmailVerified = false;

  @Property({ default: false })
  isPhoneVerified = false;

  @Property({ type: 'uuid', persist: false })
  userId!: Uuid;

  @OneToOne(() => UserEntity, {
    mapToPk: true,
    joinColumn: 'user_id',
    columnType: 'uuid',
    deleteRule: 'cascade',
    updateRule: 'cascade',
  })
  user?: Type<UserEntity>;
}
