import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import type { PageDto } from '@abstract/dto/page.dto';
import { CreatePostCommand } from './commands/create-post.command';
import type { CreatePostDto } from './dtos/create-post.dto';
import type { PostPageOptionsDto } from './dtos/post-page-options.dto';
import type { PostDto } from './dtos/post.dto';
import type { UpdatePostDto } from './dtos/update-post.dto';
import { PostNotFoundException } from './exceptions/post-not-found.exception';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: EntityRepository<PostEntity>,
    private commandBus: CommandBus,
  ) {}

  // @Transactional()
  createPost(userId: Uuid, createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.commandBus.execute<CreatePostCommand, PostEntity>(
      new CreatePostCommand(userId, createPostDto),
    );
  }

  async getAllPost(
    postPageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<PostDto>> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.translations', 'postTranslation');
    const [items, pageMetaDto] =
      await queryBuilder.paginate(postPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getSinglePost(id: Uuid): Promise<PostEntity> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .where('post.id = ?', [id]);

    const postEntity = await queryBuilder.getSingleResult();

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    return postEntity;
  }

  async updatePost(id: Uuid, updatePostDto: UpdatePostDto): Promise<void> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .where('post.id = ?', [id]);

    const postEntity = await queryBuilder.getSingleResult();

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    this.postRepository.merge(postEntity, updatePostDto);

    await this.postRepository.nativeDelete({ id }, updatePostDto);
  }

  async deletePost(id: Uuid): Promise<void> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .where('post.id = ?', [id]);

    const postEntity = await queryBuilder.getSingleResult();

    if (!postEntity) {
      throw new PostNotFoundException();
    }

    await this.postRepository.nativeDelete({ id });
  }
}
