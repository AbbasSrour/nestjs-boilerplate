import { Reflector } from '@nestjs/core';
import { RoleType } from '@constant/role-type';

export const Roles = Reflector.createDecorator<RoleType[]>();
