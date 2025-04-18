import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { RoleType } from '@constant/role-type';
import { TokenType } from '@constant/token-type';
import type { UserEntity } from '@module/user/entity/user.entity';
import { UserService } from '@module/user/user.service';
import { ApiConfigService } from '@package/shared/services/api-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
      passReqToCallback: true,
    });
  }

  async validate(args: {
    userId: Uuid;
    role: RoleType;
    type: TokenType;
  }): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({
      // FIXME: issue with type casts
      id: args.userId as never,
      role: args.role,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
