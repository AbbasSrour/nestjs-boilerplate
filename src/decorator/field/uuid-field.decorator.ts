import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, NotEquals } from 'class-validator';

import { ToArray } from '../transformer/to-array.decorator';
import { IsNullable } from '../validator/is-nullable.decorator';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import { type IFieldOptions } from './field-options';

export function ApiUUIDProperty(
  options: Omit<ApiPropertyOptions, 'type' | 'format'> &
    Partial<{ each: boolean }> = {},
): PropertyDecorator {
  return ApiProperty({
    type: options.each ? [String] : String,
    format: 'uuid',
    isArray: options.each,
    ...options,
  });
}

export function ApiUUIDPropertyOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'format' | 'required'> &
    Partial<{ each: boolean }> = {},
): PropertyDecorator {
  return ApiUUIDProperty({ required: false, ...options });
}

export function UUIDField(
  options: Omit<ApiPropertyOptions, 'type' | 'format' | 'isArray'> &
    IFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => String), IsUUID('4', { each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiUUIDProperty(options));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  return applyDecorators(...decorators);
}

export function UUIDFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'isArray'> &
    IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    UUIDField({ required: false, ...options }),
  );
}
