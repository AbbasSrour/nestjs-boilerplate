import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../abstract/dto/abstract.dto';
import {
  DynamicTranslate,
  StaticTranslate,
} from '../../../decorator/translate.decorator';
import type { I18nPath } from '../../../generated/i18n.generated';
import type { PostEntity } from '../post.entity';
import { PostTranslationDto } from './post-translation.dto';

export class PostDto extends AbstractDto {
  @ApiPropertyOptional()
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

    this.info = 'admin.keywords.admin';
  }
}
