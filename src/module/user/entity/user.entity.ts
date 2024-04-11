import {
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  Opt,
  Property,
} from '@mikro-orm/core';

import { AbstractEntity } from '../../../abstract/entity/abstract.entity';
import { RoleType } from '../../../constant/role-type';
import { UseDto } from '../../../decorator/use-dto.decorator';
import { PostEntity } from '../../post/post.entity';
import { UserDto, type UserDtoOptions } from '../dto/user.dto';
import { UserSettingsEntity } from './user-settings.entity';

@Entity({ tableName: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {
  @Property({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Property({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  @Enum({ items: () => RoleType, default: RoleType.USER, type: 'enum' })
  role!: Opt<RoleType>;

  @Property({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Property({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Property({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Property({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @Property({
    columnType: `varchar(100) generated always as (concat(first_name, ' ', last_name)) virtual`,
  })
  fullName!: Opt<string>;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user, {
    orphanRemoval: true,
    owner: true,
  })
  settings?: UserSettingsEntity;

  @OneToMany(() => PostEntity, (postEntity) => postEntity.user)
  posts?: PostEntity[];
}
