import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength, MinLength, NotEquals } from 'class-validator';
import { ToLowerCase } from 'decorator/transformers/to-lowercase.decorator';

import { ToUpperCase } from '../transformers/to-uppercase.decorator';
import { IsNullable } from '../validator/is-nullable.decorator';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import { type IFieldOptions } from './field-options';

export interface IStringFieldOptions extends IFieldOptions {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
}

export function StringField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => String), IsString({ each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, ...options, isArray: options.each }),
    );
  }

  const minLength = options.minLength || 1;

  decorators.push(MinLength(minLength, { each: options.each }));

  if (options.maxLength) {
    decorators.push(MaxLength(options.maxLength, { each: options.each }));
  }

  if (options.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    StringField({ required: false, ...options }),
  );
}
