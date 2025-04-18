import { Transform } from 'class-transformer';

/**
 * A property decorator that transforms a string value ('true' or 'false') into its respective boolean representation.
 * For any other value, it will return the original value without transformation.
 *
 * @return {PropertyDecorator} A decorator that applies the transformation logic.
 */
export function ToBoolean(): PropertyDecorator {
  return Transform(
    (params) => {
      switch (params.value) {
        case 'true': {
          return true;
        }

        case 'false': {
          return false;
        }

        default: {
          return params.value;
        }
      }
    },
    { toClassOnly: true },
  );
}
