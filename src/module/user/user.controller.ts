import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../abstract/dto/page.dto.ts';
import { RoleType } from '../../constant/role-type.ts';
import { ApiPageOkResponse } from '../../decorator/api-page-ok-response.decorator.ts';
import { Auth } from '../../decorator/auth.decorator.ts';
import { AuthUser } from '../../decorator/auth-user.decorator.ts';
import { UseLanguageInterceptor } from '../../interceptor/language-interceptor.service.ts';
import { TranslationService } from '../../packages/shared/services/translation.service.ts';
import { UUIDParam } from '../../pipe/uuid-param.pipe.ts';
import { UserDto } from './dto/user.dto.ts';
import { UsersPageOptionsDto } from './dto/users-page-options.dto.ts';
import { UserEntity } from './entity/user.entity.ts';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly translationService: TranslationService,
  ) {}

  @Get('admin')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @UseLanguageInterceptor()
  async admin(@AuthUser() user: UserEntity) {
    const translation = await this.translationService.translate(
      'admin.keywords.admin',
    );

    return {
      text: `${translation} ${user.firstName}`,
    };
  }

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: PageDto,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
  })
  getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.getUser(userId);
  }
}
