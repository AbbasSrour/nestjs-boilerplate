import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, NotEquals } from 'class-validator';

import { IsNullable } from '../validator/is-nullable.decorator';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import type { IFieldOptions } from './field-options';

export function DateField(
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => Date), IsDate()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Date, ...options }));
  }

  return applyDecorators(...decorators);
}

export function DateFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    DateField({ ...options, required: false }),
  );
}
