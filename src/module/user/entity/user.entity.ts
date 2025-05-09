import { Entity, Enum, OneToOne, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@abstract/entity/abstract.entity';
import { RoleType } from '@constant/role-type';
import { UseDto } from '@decorator/use-dto.decorator';
import type { Type } from '@interface/type';
import type { UserDtoOptions } from '../dto/user.dto';
import { UserDto } from '../dto/user.dto';
import { UserSettingsEntity } from './user-settings.entity';

@Entity({ tableName: 'users' })
@UseDto(() => UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
  @Property({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Property({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  @Enum({
    items: () => RoleType,
    default: RoleType.USER,
    nativeEnumName: 'user_role_type',
  })
  role: RoleType = RoleType.USER;

  @Property({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Property({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Property({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Property({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  // @Property<UserEntity>({
  //   length: 100,
  //   persist: false,
  //   generated: (cols) =>
  //     `(concat(${cols.firstName}, ' ', ${cols.lastName})) virtual`,
  // })
  // fullName!: string;

  @OneToOne(
    () => UserSettingsEntity,
    (userSettings) => userSettings.user,
  )
  settings?: Type<UserSettingsEntity>;
}
