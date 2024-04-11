import { type Collection, Opt, PrimaryKey, Property } from '@mikro-orm/core';

import { type Constructor } from '../../types';
import { type AbstractDto } from '../dto/abstract.dto';
import { type AbstractTranslationEntity } from './abstract-translation.entity';

/**
 * Abstract Entity
 * @author Narek Hakobyan <narek.hakobyan.07@gmail.com>
 * @author Abbas Srour <abbas.mj.srour@gmail.com>
 *
 * @description This class is an abstract class for all entities.
 * It takes two generic types: DTO for data transfer object and O for page options.
 * It takes care of the id, createdAt, updatedAt fields and translations.
 */
export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O = any,
  Optional = any,
> {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: Uuid;

  @Property({ type: 'timestamp', columnType: 'timestamp', defaultRaw: 'now()' })
  createdAt: Opt<Date> = new Date();

  @Property({
    type: 'timestamp',
    columnType: 'timestamp',
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt: Opt<Date> = new Date();

  translations?: Collection<AbstractTranslationEntity>;

  dtoClass?: () => Constructor<DTO, [AbstractEntity, O?, Optional?]>;

  toDto(options?: O): DTO {
    const dtoClass = Object.getPrototypeOf(this).dtoClass?.();

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new dtoClass(this, options);
  }
}
