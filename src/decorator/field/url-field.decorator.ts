import { applyDecorators } from '@nestjs/common';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { IsUrl, NotEquals } from 'class-validator';

import { IsNullable } from '../validator/is-nullable.decorator';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import {
  type IStringFieldOptions,
  StringField,
} from './string-field.decorator';

export function URLField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [StringField(options), IsUrl({}, { each: true })];

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  return applyDecorators(...decorators);
}

export function URLFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    URLField({ required: false, ...options }),
  );
}
