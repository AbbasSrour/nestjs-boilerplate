import { DateField } from '@decorator/field/date-field.decorator';
import { UUIDField } from '@decorator/field/uuid-field.decorator';
import { DYNAMIC_TRANSLATION_DECORATOR_KEY } from '@decorator/translate.decorator';
import { ContextProvider } from '@provider/context.provider';
import type { AbstractEntity } from '../entity/abstract.entity';
import type { AbstractTranslationDto } from './abstract-translation.dto';

export class AbstractDto {
  @UUIDField()
  id!: Uuid;

  @DateField()
  createdAt!: Date;

  @DateField()
  updatedAt!: Date;

  translations?: AbstractTranslationDto[];

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }

    const languageCode = ContextProvider.getLanguage();

    if (languageCode && entity.translations) {
      const translationEntity = entity.translations.find(
        (titleTranslation) => titleTranslation.languageCode === languageCode,
      );

      const fields: Record<string, string> = {};

      for (const key of Object.keys(translationEntity || {})) {
        const metadata = Reflect.getMetadata(
          DYNAMIC_TRANSLATION_DECORATOR_KEY,
          this,
          key,
        );

        if (metadata && translationEntity && key in translationEntity) {
          fields[key] = translationEntity[key];
        }
      }

      Object.assign(this, fields);
    } else {
      this.translations = entity.translations?.getItems().toDtos();
    }
  }
}
