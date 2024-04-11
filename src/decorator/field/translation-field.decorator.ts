import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IFieldOptions } from './field-options';
import {
  ArrayMaxSize,
  ArrayMinSize,
  NotEquals,
  ValidateNested,
} from 'class-validator';
import { supportedLanguageCount } from '../../constant/language-code';
import { Type } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { RequireField } from '../../types';
import { IsUndefinable } from '../validator/is-undefinable.decorator';
import { IsNullable } from '../validator/is-nullable.decorator';

export function TranslationsField(
  options: RequireField<Omit<ApiPropertyOptions, 'isArray'>, 'type'> &
    IFieldOptions,
): PropertyDecorator {
  const decorators = [
    ArrayMinSize(supportedLanguageCount),
    ArrayMaxSize(supportedLanguageCount),
    ValidateNested({
      each: true,
    }),
    Type(() => options.type as FunctionConstructor),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ isArray: true, ...options }));
  }

  return applyDecorators(...decorators);
}

export function TranslationsFieldOptional(
  options: RequireField<Omit<ApiPropertyOptions, 'isArray'>, 'type'> &
    IFieldOptions,
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    TranslationsField({ required: false, ...options }),
  );
}
