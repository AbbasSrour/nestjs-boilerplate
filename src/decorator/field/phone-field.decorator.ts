import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { IsPhoneNumber, NotEquals } from 'class-validator';

import { PhoneNumberSerializer } from '../transformer/phone-number-serializer.decorator';
import { IsNullable } from '../validator/is-nullable.decorator';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import type { IFieldOptions } from './field-options';

export function PhoneField(
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [IsPhoneNumber(), PhoneNumberSerializer()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function PhoneFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    PhoneField({ required: false, ...options }),
  );
}
