import type { AbstractEntity } from '../entity/abstract.entity';
import { AbstractDto } from './abstract.dto';

export class AbstractTranslationDto extends AbstractDto {
  constructor(entity: AbstractEntity) {
    super(entity, { excludeFields: true });
  }
}
