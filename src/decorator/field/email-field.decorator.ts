import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { IsEmail, NotEquals } from 'class-validator';

import { IsNullable } from '../validator/is-nullable.decorator';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import {
  type IStringFieldOptions,
  StringField,
} from './string-field.decorator';

export function EmailField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsEmail(),
    StringField({ toLowerCase: true, ...options }),
  ];

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

export function EmailFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    EmailField({ required: false, ...options }),
  );
}
