import { CreateRequestContext } from '@mikro-orm/core';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constant/role-type';
import { Auth } from '../../decorator/auth.decorator';
import { AuthUser } from '../../decorator/auth-user.decorator';
import { ApiFile } from '../../decorator/field/api-file.decorator';
import { IFile } from '../../interface';
import { UserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/service/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: userEntity.role,
    });

    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  @ApiFile({ name: 'avatar' })
  @CreateRequestContext()
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() file?: IFile,
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(
      userRegisterDto,
      file,
    );

    return createdUser.toDto({
      isActive: true,
    });
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }
}
