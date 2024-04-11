import { LanguageCode } from '../../constant/language-code';
import { EnumField } from '../../decorator/field/enum-field.decorator';
import { StringField } from '../../decorator/field/string-field.decorator';

export class CreateTranslationDto {
  @EnumField(() => LanguageCode)
  languageCode!: LanguageCode;

  @StringField()
  text!: string;
}
