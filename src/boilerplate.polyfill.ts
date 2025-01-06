import 'source-map-support/register';

import type { QBFilterQuery } from '@mikro-orm/core';
import type { JoinType, SelectQueryBuilder } from '@mikro-orm/postgresql';
import { QueryBuilder } from '@mikro-orm/postgresql';
import { compact, map } from 'lodash';

import type { AbstractDto } from './abstract/dto/abstract.dto';
import type { CreateTranslationDto } from './abstract/dto/create-translation.dto';
import { PageDto } from './abstract/dto/page.dto';
import { PageMetaDto } from './abstract/dto/page-meta.dto';
import type { PageOptionsDto } from './abstract/dto/page-options.dto';
import type { AbstractEntity } from './abstract/entity/abstract.entity';
import type { LanguageCode } from './constant/language-code';
import type { KeyOfType } from './types';

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

// eslint-disable-next-line canonical/no-use-extend-native
Array.prototype.getByLanguage = function (languageCode: LanguageCode): string {
  return this.find((translation) => languageCode === translation.languageCode)!
    .text;
};

// eslint-disable-next-line canonical/no-use-extend-native
Array.prototype.toPageDto = function (
  pageMetaDto: PageMetaDto,
  options?: unknown,
) {
  return new PageDto(this.toDtos(options), pageMetaDto);
};

declare module '@mikro-orm/postgresql' {
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/ban-types
  interface QueryBuilder<Entity extends object> {
    searchByString(
      q: string,
      columnNames: string[],
      options?: {
        formStart: boolean;
      },
    ): this;

    paginate(
      this: QueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
      options?: Partial<{ takeAll: boolean; skipCount: boolean }>,
    ): Promise<[Entity[], PageMetaDto]>;

    join<AliasEntity extends AbstractEntity, A extends string>(
      this: QueryBuilder<Entity>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      cond?: QBFilterQuery,
      type?: JoinType,
      path?: string,
      schema?: string,
    ): this;
    innerJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: QueryBuilder<Entity>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      condition?: string,
      schema?: string,
    ): this;
    innerJoinLateral<AliasEntity extends AbstractEntity, A extends string>(
      this: QueryBuilder<Entity>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      cond?: QBFilterQuery,
      schema?: string,
    ): this;
    leftJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: QueryBuilder<Entity>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      condition?: QBFilterQuery,
      schema?: string,
    ): this;
    leftJoinLateral<AliasEntity extends AbstractEntity, A extends string>(
      this: QueryBuilder<Entity>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      cond?: QBFilterQuery,
      schema?: string,
    ): this;
    joinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: QueryBuilder<Entity>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      cond?: QBFilterQuery,
      type?: JoinType,
      path?: string,
      fields?: string[],
      schema?: string,
    ): SelectQueryBuilder<Entity>;
    leftJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: QueryBuilder<Entity>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      cond?: QBFilterQuery,
      fields?: string[],
      schema?: string,
    ): SelectQueryBuilder<Entity>;
    leftJoinLateralAndSelect<
      AliasEntity extends AbstractEntity,
      A extends string,
    >(
      this: QueryBuilder<Entity>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      cond?: QBFilterQuery,
      fields?: string[],
      schema?: string,
    ): SelectQueryBuilder<Entity>;
    innerJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: QueryBuilder<Entity>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      cond?: QBFilterQuery,
      fields?: string[],
      schema?: string,
    ): SelectQueryBuilder<Entity>;
    innerJoinLateralAndSelect<
      AliasEntity extends AbstractEntity,
      A extends string,
    >(
      this: QueryBuilder<Entity>,
      field: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      cond?: QBFilterQuery,
      fields?: string[],
      schema?: string,
    ): SelectQueryBuilder<Entity>;
  }
}

QueryBuilder.prototype.searchByString = function (q, columnNames, options) {
  if (!q) {
    return this;
  }

  let query = '';
  const params = new Array<string>();

  for (const columnName of columnNames) {
    query += `${columnName} ILIKE ? OR `;

    if (options?.formStart) {
      params.push(`${q}%`);
    } else {
      params.push(`%${q}%`);
    }
  }

  this.andWhere(`(${query.slice(0, -4)})`, params);

  return this;
};

QueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
  options?: Partial<{
    skipCount: boolean;
    takeAll: boolean;
  }>,
) {
  const qb = this.clone();

  if (!options?.takeAll) {
    qb.limit(pageOptionsDto.take, pageOptionsDto.skip);
  }

  const [entities, itemCount] = await qb.getResultAndCount();

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [entities, pageMetaDto];
};
