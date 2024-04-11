import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { UseDto } from 'decorator/use-dto.decorator';

import { AbstractEntity } from '../../../abstract/entity/abstract.entity';
import { type UserDto, type UserDtoOptions } from '../dto/user.dto';
import { UserSettingsDto } from '../dto/user-settings.dto';
import { UserEntity } from './user.entity';

@Entity({ tableName: 'user_settings' })
@UseDto(UserSettingsDto)
export class UserSettingsEntity extends AbstractEntity<
  UserDto,
  UserDtoOptions
> {
  @Property({ default: false })
  isEmailVerified!: boolean;

  @Property({ default: false })
  isPhoneVerified!: boolean;

  @Property({ type: 'uuid' })
  userId!: Uuid;

  @OneToOne(() => UserEntity, (user) => user.settings, {
    // onDelete: 'CASCADE',
    // onUpdate: 'CASCADE',
  })
  // @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
