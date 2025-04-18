import { CreateTranslationDto } from '@abstract/dto/create-translation.dto';
import { TranslationsField } from '@decorator/field/translation-field.decorator';

export class CreatePostDto {
  @TranslationsField({ type: CreateTranslationDto })
  title!: CreateTranslationDto[];

  @TranslationsField({ type: CreateTranslationDto })
  description!: CreateTranslationDto[];
}
