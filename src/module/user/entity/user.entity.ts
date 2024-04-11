import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import { AbstractEntity } from '../../../abstract/entity/abstract.entity.ts';
import { RoleType } from '../../../constant/role-type.ts';
import { UseDto } from '../../../decorator/use-dto.decorator.ts';
import { PostEntity } from '../../post/post.entity.ts';
import type { UserDtoOptions } from '../dto/user.dto.ts';
import { UserDto } from '../dto/user.dto.ts';
import { UserSettingsEntity } from './user-settings.entity.ts';

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

  // @VirtualProperty({
  //   query: (alias) =>
  //     `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  // })
  // fullName!: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @OneToMany(() => PostEntity, (postEntity) => postEntity.user)
  posts = new Collection<PostEntity>(this);
}
