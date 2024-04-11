import 'source-map-support/register';

import { type QBFilterQuery } from '@mikro-orm/core';
import { type QueryBuilder } from '@mikro-orm/postgresql';
import { compact, map } from 'lodash';
import { Brackets, SelectQueryBuilder } from 'typeorm';

import { type AbstractDto } from './abstract/dto/abstract.dto';
import { type CreateTranslationDto } from './abstract/dto/create-translation.dto';
import { PageDto } from './abstract/dto/page.dto';
import { PageMetaDto } from './abstract/dto/page-meta.dto';
import { type PageOptionsDto } from './abstract/dto/page-options.dto';
import { type AbstractEntity } from './abstract/entity/abstract.entity';
import { type LanguageCode } from './constant/language-code';
import { type KeyOfType } from './types';

declare global {
  export type Uuid = string & { _uuidBrand: undefined };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-redundant-type-constituents
  export type Todo = any & { _todoBrand: undefined };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: unknown): Dto[];

    getByLanguage(
      this: CreateTranslationDto[],
      languageCode: LanguageCode,
    ): string;

    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      // FIXME make option type visible from entity
      options?: unknown,
    ): PageDto<Dto>;
  }
}

// eslint-disable-next-line canonical/no-use-extend-native
Array.prototype.toDtos = function <
  Entity extends AbstractEntity<Dto>,
  Dto extends AbstractDto,
>(options?: unknown): Dto[] {
  return compact(
    map<Entity, Dto>(this as Entity[], (item) => item.toDto(options as never)),
  );
};

Array.prototype.getByLanguage = function (languageCode: LanguageCode): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return this.find((translation) => languageCode === translation.languageCode)!
    .text;
};

Array.prototype.toPageDto = function (
  pageMetaDto: PageMetaDto,
  options?: unknown,
) {
  return new PageDto(this.toDtos(options), pageMetaDto);
};

declare module '@mikro-orm/postgresql' {
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/ban-types
  interface SelectQueryBuilder<T extends object> extends QueryBuilder<T> {
    searchByString(
      q: string,
      columnNames: string[],
      options?: {
        formStart: boolean;
      },
    ): this;

    paginate(
      this: QueryBuilder<T>,
      pageOptionsDto: PageOptionsDto,
      options?: Partial<{ takeAll: boolean; skipCount: boolean }>,
    ): Promise<[T[], PageMetaDto]>;

    leftJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<T>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      condition?: QBFilterQuery,
      fields?: string[],
      schema?: string,
    ): this;

    leftJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<T>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      condition?: QBFilterQuery,
      schema?: string,
    ): this;

    innerJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<T>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      condition?: QBFilterQuery,
      fields?: string[],
      schema?: string,
    ): this;

    innerJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<T>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      condition?: string,
      schema?: string,
    ): this;
  }
}

SelectQueryBuilder.prototype.searchByString = function (
  q,
  columnNames,
  options,
) {
  if (!q) {
    return this;
  }

  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`${item} ILIKE :q`);
      }
    }),
  );

  if (options?.formStart) {
    this.setParameter('q', `${q}%`);
  } else {
    this.setParameter('q', `%${q}%`);
  }

  return this;
};

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
  options?: Partial<{
    skipCount: boolean;
    takeAll: boolean;
  }>,
) {
  if (!options?.takeAll) {
    this.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
  }

  const entities = await this.getMany();

  let itemCount = -1;

  if (!options?.skipCount) {
    itemCount = await this.getCount();
  }

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [entities, pageMetaDto];
};
