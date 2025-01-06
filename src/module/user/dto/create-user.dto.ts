import {
  StringField,
  StringFieldOptional
} from '../../../decorator/field/string-field.decorator';
import { EmailField } from '../../../decorator/field/email-field.decorator';
import { PasswordField } from '../../../decorator/field/password-field.decorator';

export class CreateUserDto {
  @StringField()
  readonly firstName!: string;

  @StringField()
  readonly lastName!: string;

  @EmailField()
  readonly email!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;

  @StringFieldOptional()
  phone?: string;
}
