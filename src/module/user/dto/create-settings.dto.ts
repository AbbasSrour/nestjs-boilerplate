import { BooleanFieldOptional } from '../../../decorator/field/boolean-field.decorator.ts';

export class CreateSettingsDto {
  @BooleanFieldOptional()
  isEmailVerified?: boolean;

  @BooleanFieldOptional()
  isPhoneVerified?: boolean;
}
