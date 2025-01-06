import { EmailField } from '../../../decorator/field/email-field.decorator';
import { StringField } from '../../../decorator/field/string-field.decorator';

export class UserLoginDto {
  @EmailField()
  readonly email!: string;

  @StringField()
  readonly password!: string;
}
