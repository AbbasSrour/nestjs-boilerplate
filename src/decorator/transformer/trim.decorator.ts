import { Transform } from 'class-transformer';
import _ from 'lodash';

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

    if (_.isArray(value)) {
      return _.map(value, (v) => _.trim(v).replaceAll(/\s\s+/g, ' '));
    }

    return _.trim(value).replaceAll(/\s\s+/g, ' ');
  });
}
