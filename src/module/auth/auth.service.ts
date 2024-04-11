import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { type RoleType } from '../../constant/role-type';
import { TokenType } from '../../constant/token-type';
import { UserNotFoundException } from '../../exception';
import { GeneratorProvider } from '../../provider/generator.provider';
import { ApiConfigService } from '../shared/services/api-config.service';
import { type UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/service/user.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { type UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
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

    const isPasswordValid = await GeneratorProvider.validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user!;
  }
}
