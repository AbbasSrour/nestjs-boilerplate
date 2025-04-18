import { Transform } from 'class-transformer';
import { isArray, map, trim } from 'lodash';

/**
 * @description trim spaces from start and end, replace multiple spaces with one.
 * @example
 * @ApiProperty()
 * @IsString()
 * @Trim()
 * name: string;
 * @returns PropertyDecorator
 * @constructor
 */
export function Trim(): PropertyDecorator {
  return Transform((params) => {
    const value = params.value as string[] | string;

    if (isArray(value)) {
      return map(value, (v) => trim(v).replaceAll(/\s\s+/g, ' '));
    }

    return trim(value).replaceAll(/\s\s+/g, ' ');
  });
}
