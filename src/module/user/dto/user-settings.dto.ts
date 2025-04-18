import { AbstractDto } from '@abstract/dto/abstract.dto';
import { BooleanField } from '@decorator/field/boolean-field.decorator';
import { UUIDField } from '@decorator/field/uuid-field.decorator';
import type { UserSettingsEntity } from '../entity/user-settings.entity';

export type UserSettingsDtoOptions = Partial<{ isActive: boolean }>;

export class UserSettingsDto extends AbstractDto {
  @BooleanField()
  isEmailVerified!: boolean;

  @BooleanField()
  isPhoneVerified?: boolean;

  @UUIDField()
  userId!: Uuid;

  constructor(userSettings: UserSettingsEntity) {
    super(userSettings);
    this.isEmailVerified = userSettings.isEmailVerified;
    this.isPhoneVerified = userSettings.isPhoneVerified;
    this.userId = userSettings.userId;
  }
}
