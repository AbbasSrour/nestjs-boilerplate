import { applyDecorators } from '@nestjs/common';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { NotEquals } from 'class-validator';
import { IsNullable } from '../validator/is-nullable.decorator';
import { IsPassword } from '../validator/is-password.decorator';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import {
  type IStringFieldOptions,
  StringField,
} from './string-field.decorator';

export function PasswordField(
  options: Omit<ApiPropertyOptions, 'type' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [StringField({ ...options, minLength: 6 }), IsPassword()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function PasswordFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    PasswordField({ required: false, ...options }),
  );
}
