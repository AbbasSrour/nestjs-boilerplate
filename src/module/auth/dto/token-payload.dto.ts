import { NumberField } from '../../../decorator/field/number-field.decorator';
import { StringField } from '../../../decorator/field/string-field.decorator';

export class TokenPayloadDto {
  @NumberField()
  expiresIn: number;

  @StringField()
  token: string;

  constructor(data: { expiresIn: number; token: string }) {
    this.expiresIn = data.expiresIn;
    this.token = data.token;
  }
}
