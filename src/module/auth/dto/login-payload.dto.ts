import { ClassField } from '@decorator/field/class-field.decorator';
import { UserDto } from '../../user/dto/user.dto';
import { TokenPayloadDto } from './token-payload.dto';

export class LoginPayloadDto {
  @ClassField(() => UserDto)
  user: UserDto;

  @ClassField(() => TokenPayloadDto)
  accessToken: TokenPayloadDto;

  constructor(user: UserDto, accessToken: TokenPayloadDto) {
    this.user = user;
    this.accessToken = accessToken;
  }
}
