import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import {
  type IStringFieldOptions,
  StringField,
} from './string-field.decorator';
import { NotEquals } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { IsTmpKey } from '../validator/is-tmpkey.decorator';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import { IsNullable } from '../validator/is-nullable.decorator';

export function TmpKeyField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [StringField(options), IsTmpKey({ each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, ...options, isArray: options.each }),
    );
  }

  return applyDecorators(...decorators);
}

export function TmpKeyFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    TmpKeyField({ required: false, ...options }),
  );
}
