import { CreateTranslationDto } from '../../../abstract/dto/create-translation.dto.ts';
import { TranslationsField } from '../../../decorator/field/translation-field.decorator.ts';

export class CreatePostDto {
  @TranslationsField({ type: CreateTranslationDto })
  title!: CreateTranslationDto[];

  @TranslationsField({ type: CreateTranslationDto })
  description!: CreateTranslationDto[];
}
