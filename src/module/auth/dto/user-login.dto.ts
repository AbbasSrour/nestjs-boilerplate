import { EmailField } from '../../../decorator/field/email-field.decorator.ts';
import { StringField } from '../../../decorator/field/string-field.decorator.ts';

export class UserLoginDto {
  @EmailField()
  readonly email!: string;

  @StringField()
  readonly password!: string;
}
