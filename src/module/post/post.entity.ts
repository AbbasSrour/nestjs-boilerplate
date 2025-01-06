import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import { AbstractEntity } from '../../abstract/entity/abstract.entity';
import { UseDto } from '../../decorator/use-dto.decorator';
import { UserEntity } from '../user/entity/user.entity';
import { PostDto } from './dtos/post.dto';
import { PostTranslationEntity } from './post-translation.entity';
import type { Type } from 'interface/type';

@Entity({ tableName: 'posts' })
@UseDto(() => PostDto)
export class PostEntity extends AbstractEntity<PostDto> {
  @Property({ type: 'uuid', persist: false })
  userId!: Uuid;

  @ManyToOne(() => UserEntity, {
    referenceColumnName: 'id',
    joinColumn: 'user_id',
    deleteRule: 'cascade',
    updateRule: 'cascade',
    nullable: false,
  })
  user?: Type<UserEntity>;

  @OneToMany(
    () => PostTranslationEntity,
    (postTranslationEntity) => postTranslationEntity.post,
  )
  translations = new Collection<PostTranslationEntity>(this);
}
