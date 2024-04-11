import { ApiProperty } from '@nestjs/swagger';

import { ClassField } from '../../decorator/field/class-field.decorator';
import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ClassField(() => PageMetaDto)
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
