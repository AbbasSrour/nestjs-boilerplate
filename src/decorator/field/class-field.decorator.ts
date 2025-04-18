import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, NotEquals, ValidateNested } from 'class-validator';

import type { Constructor } from '@src/types';
import { IsNullable } from '../validator/is-nullable.decorator';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import type { IFieldOptions } from './field-options';

type IClassFieldOptions = IFieldOptions;

export function ClassField<TClass extends Constructor>(
  getClass: () => TClass,
  options: Omit<ApiPropertyOptions, 'type'> & IClassFieldOptions = {},
): PropertyDecorator {
  const classValue = getClass();

  const decorators = [
    Type(() => classValue),
    ValidateNested({ each: options.each }),
  ];

  if (options.required !== false) {
    decorators.push(IsDefined());
  }

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({
        type: () => classValue,
        ...options,
      }),
    );
  }

  // if (options.each) {
  //   decorators.push(ToArray());
  // }

  return applyDecorators(...decorators);
}

export function ClassFieldOptional<TClass extends Constructor>(
  getClass: () => TClass,
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IClassFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    ClassField(getClass, { required: false, ...options }),
  );
}
