import { AbstractDto } from '../../../abstract/dto/abstract.dto.ts';
import { RoleType } from '../../../constant/role-type.ts';
import { BooleanFieldOptional } from '../../../decorator/field/boolean-field.decorator.ts';
import { EmailFieldOptional } from '../../../decorator/field/email-field.decorator.ts';
import { EnumFieldOptional } from '../../../decorator/field/enum-field.decorator.ts';
import { PhoneFieldOptional } from '../../../decorator/field/phone-field.decorator.ts';
import { StringFieldOptional } from '../../../decorator/field/string-field.decorator.ts';
import type { UserEntity } from '../entity/user.entity.ts';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  @StringFieldOptional({ nullable: true })
  firstName?: string | null;

  @StringFieldOptional({ nullable: true })
  lastName?: string | null;

  @StringFieldOptional({ nullable: true })
  username!: string;

  @EnumFieldOptional(() => RoleType)
  role?: RoleType;

  @EmailFieldOptional({ nullable: true })
  email?: string | null;

  @StringFieldOptional({ nullable: true })
  avatar?: string | null;

  @PhoneFieldOptional({ nullable: true })
  phone?: string | null;

  @BooleanFieldOptional()
  isActive?: boolean;

  constructor(user: UserEntity, options?: UserDtoOptions) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.isActive = options?.isActive;
  }
}
