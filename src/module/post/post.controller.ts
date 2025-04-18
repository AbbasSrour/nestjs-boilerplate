import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import type { PageDto } from '@abstract/dto/page.dto';
import { RoleType } from '@constant/role-type';
import { ApiPageOkResponse } from '@decorator/api-page-ok-response.decorator';
import { AuthUser } from '@decorator/auth-user.decorator';
import { Auth } from '@decorator/auth.decorator';
import { UseLanguageInterceptor } from '@interceptor/language-interceptor.service';
import { UUIDParam } from '@pipe/uuid-param.pipe';
import type { UserEntity } from '../user/entity/user.entity';
import type { CreatePostDto } from './dtos/create-post.dto';
import type { PostPageOptionsDto } from './dtos/post-page-options.dto';
import { PostDto } from './dtos/post.dto';
import type { UpdatePostDto } from './dtos/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: PostDto })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @AuthUser() user: UserEntity,
  ) {
    const postEntity = await this.postService.createPost(
      user.id,
      createPostDto,
    );

    return postEntity.toDto();
  }

  @Get()
  @Auth([RoleType.USER])
  @UseLanguageInterceptor()
  @ApiPageOkResponse({ type: PostDto })
  async getPosts(
    @Query() postsPageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<PostDto>> {
    return this.postService.getAllPost(postsPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PostDto })
  async getSinglePost(@UUIDParam('id') id: Uuid): Promise<PostDto> {
    const entity = await this.postService.getSinglePost(id);

    return entity.toDto();
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  updatePost(
    @UUIDParam('id') id: Uuid,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async deletePost(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.postService.deletePost(id);
  }
}
