import { EmailFieldOptional } from '@decorator/field/email-field.decorator';
import { PhoneFieldOptional } from '@decorator/field/phone-field.decorator';
import { StringFieldOptional } from '@decorator/field/string-field.decorator';

export class UpdateUserDto {
  @StringFieldOptional()
  readonly firstName?: string;

  @StringFieldOptional()
  readonly lastName?: string;

  @EmailFieldOptional()
  readonly email?: string;

  @PhoneFieldOptional()
  phone?: string;
}
