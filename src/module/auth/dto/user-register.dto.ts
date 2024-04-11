import { EmailField } from '../../../decorator/field/email-field.decorator.ts';
import { PasswordField } from '../../../decorator/field/password-field.decorator.ts';
import { PhoneFieldOptional } from '../../../decorator/field/phone-field.decorator.ts';
import { StringField } from '../../../decorator/field/string-field.decorator.ts';

export class UserRegisterDto {
  @StringField()
  readonly firstName!: string;

  @StringField()
  readonly lastName!: string;

  @EmailField()
  readonly email!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;

  @PhoneFieldOptional()
  phone?: string;
}
