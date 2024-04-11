import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../abstract/dto/abstract.dto.ts';
import {
  DynamicTranslate,
  StaticTranslate,
} from '../../../decorator/translate.decorator.ts';
import { I18nPath } from '../../../generated/i18n.generated.ts';
import type { PostEntity } from '../post.entity';
import { PostTranslationDto } from './post-translation.dto';

export class PostDto extends AbstractDto {
  @ApiPropertyOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @DynamicTranslate()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  @StaticTranslate()
  info: I18nPath;

  @ApiPropertyOptional({ type: PostTranslationDto, isArray: true })
  declare translations?: PostTranslationDto[];

  constructor(postEntity: PostEntity) {
    super(postEntity);

    this.info = 'info.keywords.admin';
  }
}
