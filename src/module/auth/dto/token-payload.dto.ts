import { NumberField } from '../../../decorator/field/number-field.decorator';
import { StringField } from '../../../decorator/field/string-field.decorator';

export class TokenPayloadDto {
  @NumberField()
  expiresIn: number;

  @StringField()
  accessToken: string;

  constructor(data: { expiresIn: number; accessToken: string }) {
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
  }
}
