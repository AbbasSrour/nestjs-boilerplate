import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { RoleType } from '@constant/role-type';
import { TokenType } from '@constant/token-type';
import { UserNotFoundException } from '@exception/user-not-found.exception';
import { ApiConfigService } from '@package/shared/services/api-config.service';
import { GeneratorProvider } from '@provider/generator.provider';
import type { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import type { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      token: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      email: userLoginDto.email,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await GeneratorProvider.validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
