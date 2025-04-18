import { AbstractTranslationDto } from '@abstract/dto/abstract-translation.dto';
import { LanguageCode } from '@constant/language-code';
import { EnumFieldOptional } from '@decorator/field/enum-field.decorator';
import { StringFieldOptional } from '@decorator/field/string-field.decorator';
import type { PostTranslationEntity } from '../post-translation.entity';

export class PostTranslationDto extends AbstractTranslationDto {
  @StringFieldOptional()
  title?: string;

  @StringFieldOptional()
  description?: string;

  @EnumFieldOptional(() => LanguageCode)
  languageCode?: LanguageCode;

  constructor(postTranslationEntity: PostTranslationEntity) {
    super(postTranslationEntity);
    this.title = postTranslationEntity.title;
    this.description = postTranslationEntity.description;
    this.languageCode = postTranslationEntity.languageCode;
  }
}
