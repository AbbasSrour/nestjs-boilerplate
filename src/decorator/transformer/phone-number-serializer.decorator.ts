import { Transform } from 'class-transformer';
import { parsePhoneNumber } from 'libphonenumber-js';

export function PhoneNumberSerializer(): PropertyDecorator {
  return Transform((params) => parsePhoneNumber(params.value as string).number);
}
