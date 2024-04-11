import { Entity, OneToOne, Property } from '@mikro-orm/core';

import { AbstractEntity } from '../../../abstract/entity/abstract.entity.ts';
import { UseDto } from '../../../decorator/use-dto.decorator.ts';
import type { UserDto, UserDtoOptions } from '../dto/user.dto.ts';
import { UserSettingsDto } from '../dto/user-settings.dto.ts';
import { UserEntity } from './user.entity.ts';

@Entity({ tableName: 'user_settings' })
@UseDto(() => UserSettingsDto)
export class UserSettingsEntity extends AbstractEntity<
  UserDto,
  UserDtoOptions
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
  user?: UserEntity;
}
