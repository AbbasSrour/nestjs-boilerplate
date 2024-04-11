import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { IsEnum, NotEquals } from 'class-validator';

import { GeneratorProvider } from '../../provider/generator.provider';
import { ToArray } from '../transformer/to-array.decorator';
import { IsNullable } from '../validator/is-nullable.decorator';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import { type IFieldOptions } from './field-options';

type IEnumFieldOptions = IFieldOptions;

// eslint-disable-next-line canonical/no-unused-exports,@typescript-eslint/ban-types
type ApiPropertyEnumType = never[] | Record<string, never> | Object;

export function ApiEnumProperty<TEnum extends ApiPropertyEnumType>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type'> & { each?: boolean } = {},
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enumValue = getEnum();

  return ApiProperty({
    type: 'enum',
    // throw error during the compilation of swagger
    // isArray: options.each,
    enum: enumValue,
    enumName: GeneratorProvider.getVariableName(getEnum),
    ...options,
  });
}

export function ApiEnumPropertyOptional<TEnum extends ApiPropertyEnumType>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & {
    each?: boolean;
  } = {},
): PropertyDecorator {
  return ApiEnumProperty(getEnum, { required: false, ...options });
}

// eslint-disable-next-line
export function EnumField<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName' | 'isArray'> &
    IEnumFieldOptions = {},
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
  const enumValue = getEnum();
  const decorators = [IsEnum(enumValue, { each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiEnumProperty(getEnum, { ...options, isArray: options.each }),
    );
  }

  return applyDecorators(...decorators);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function EnumFieldOptional<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'enum' | 'enumName'> &
    IEnumFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    EnumField(getEnum, { required: false, ...options }),
  );
}
