import type { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';

import { ExtendedEntityRepository } from '../../abstract/abstract-entity.repository';
import type { PageDto } from '../../abstract/dto/page.dto';
import { RoleType } from '../../constant/role-type';
import { FileNotImageException, UserNotFoundException } from '../../exception';
import type { IFile } from '../../interface';
import { ValidatorService } from '../../packages/shared/services/validator.service';
import type { UserRegisterDto } from '../auth/dto/user-register.dto';
import { CreateSettingsCommand } from './command/create-settings.command';
import { CreateSettingsDto } from './dto/create-settings.dto';
import type { UserDto } from './dto/user.dto';
import type { UsersPageOptionsDto } from './dto/users-page-options.dto';
import { UserEntity } from './entity/user.entity';
import type { UserSettingsEntity } from './entity/user-settings.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: ExtendedEntityRepository<UserEntity>,
    private validatorService: ValidatorService,
    private awsS3Service: AwsS3Service,
    private commandBus: CommandBus,
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FilterQuery<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne(findData);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect<UserEntity, 'user'>('user.settings', 'settings');

    if (options.email) {
      await queryBuilder.orWhere('u.email = ?', [options.email]);
    }

    if (options.username) {
      await queryBuilder.orWhere('u.username = ?', [options.username]);
    }

    return queryBuilder.getSingleResult();
  }

  async createUser(
    userRegisterDto: UserRegisterDto,
    file?: IFile,
  ): Promise<UserEntity> {
    const user = this.userRepository.create({
      email: userRegisterDto.email,
      firstName: userRegisterDto.firstName,
      lastName: userRegisterDto.lastName,
      password: userRegisterDto.password,
      phone: userRegisterDto.phone,
      role: RoleType.USER,
    });

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      user.avatar = await this.awsS3Service.uploadImage(file);
    }

    await this.userRepository.persistAndFlush(user);

    user.settings = await this.createSettings(
      user.id,
      plainToClass(CreateSettingsDto, {
        isEmailVerified: false,
        isPhoneVerified: false,
      }),
    );

    return user;
  }

  async getUsers(
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    void queryBuilder.andWhere({ role: RoleType.USER });
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('u');

    await queryBuilder.where('u.id = ?', [userId]);

    const userEntity = await queryBuilder.getSingleResult();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async createSettings(
    userId: Uuid,
    createSettingsDto: CreateSettingsDto,
  ): Promise<UserSettingsEntity> {
    return this.commandBus.execute<CreateSettingsCommand, UserSettingsEntity>(
      new CreateSettingsCommand(userId, createSettingsDto),
    );
  }
}
