import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  authenticate(): void {
    // TODO: Fix this
    // @ts-ignore
    return this.success({ [Symbol.for('isPublic')]: true });
  }
}
