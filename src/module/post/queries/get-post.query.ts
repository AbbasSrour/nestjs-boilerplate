import { InjectRepository } from '@mikro-orm/nestjs';
import type { EntityRepository } from '@mikro-orm/postgresql';
import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';

import { PostEntity } from '../post.entity';

export class GetPostQuery implements ICommand {
  constructor(public readonly userId: Uuid) {}
}

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: EntityRepository<PostEntity>,
  ) {}

  async execute(query: GetPostQuery) {
    return this.postRepository.findOne({
      userId: query.userId,
    });
  }
}
