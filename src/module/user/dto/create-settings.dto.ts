import { BooleanFieldOptional } from '../../../decorator/field/boolean-field.decorator';

export class CreateSettingsDto {
  @BooleanFieldOptional()
  isEmailVerified?: boolean;

  @BooleanFieldOptional()
  isPhoneVerified?: boolean;
}
