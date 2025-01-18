import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../abstract/dto/page.dto';
import { RoleType } from '../../constant/role-type';
import { ApiPageOkResponse } from '../../decorator/api-page-ok-response.decorator';
import { Auth } from '../../decorator/auth.decorator';
import { AuthUser } from '../../decorator/auth-user.decorator';
import { UseLanguageInterceptor } from '../../interceptor/language-interceptor.service';
import { TranslationService } from '../../packages/shared/services/translation.service';
import { UUIDParam } from '../../pipe/uuid-param.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly translationService: TranslationService,
  ) {}

  @Version('1')
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

  @Version('1')
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

  @Version('1')
  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create user',
    type: UserDto,
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Version('1')
  @Get(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user by id',
    type: UserDto,
  })
  getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  @Version('1')
  @Patch(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update user',
    type: UserDto,
  })
  updateUser(
    @UUIDParam('id') userId: Uuid,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Version('1')
  @Delete(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete user',
    type: undefined,
  })
  deleteUser(@UUIDParam('id') userId: Uuid) {
    return this.userService.deleteUser(userId);
  }
}
