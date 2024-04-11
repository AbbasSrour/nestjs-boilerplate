import { Injectable } from '@nestjs/common';
import { isArray, isString, map } from 'lodash';
import { I18nService, type TranslateOptions } from 'nestjs-i18n';

import { AbstractDto } from '../../../abstract/dto/abstract.dto';
import { STATIC_TRANSLATION_DECORATOR_KEY } from '../../../decorator/translate.decorator';
import { type ITranslationDecoratorInterface } from '../../../interface';
import { ContextProvider } from '../../../provider/context.provider';

@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}

  async translate(key: string, options?: TranslateOptions): Promise<string> {
    return this.i18n.translate(`${key}`, {
      ...options,
      lang: ContextProvider.getLanguage(),
    });
  }

  async translateNecessaryKeys<T extends AbstractDto>(dto: T): Promise<T> {
    await Promise.all(
      map(dto, async (value, key) => {
        if (isString(value)) {
          const translateDec = Reflect.getMetadata(
            STATIC_TRANSLATION_DECORATOR_KEY,
            dto,
            key,
          ) as ITranslationDecoratorInterface | undefined;

          if (translateDec) {
            return this.translate(
              `${translateDec.translationKey ?? key}.${value}`,
            );
          }

          return;
        }

        if (value instanceof AbstractDto) {
          return this.translateNecessaryKeys(value);
        }

        if (isArray(value)) {
          return Promise.all(
            map(value, (v) => {
              if (v instanceof AbstractDto) {
                return this.translateNecessaryKeys(v);
              }
            }),
          );
        }
      }),
    );

    return dto;
  }
}
