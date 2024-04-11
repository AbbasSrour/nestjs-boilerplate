import {
  EnsureRequestContext,
  EntityRepository,
  type FilterQuery,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';

import { type PageDto } from '../../../abstract/dto/page.dto';
import {
  FileNotImageException,
  UserNotFoundException,
} from '../../../exception';
import { type IFile } from '../../../interface';
import { type UserRegisterDto } from '../../auth/dto/user-register.dto';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { CreateSettingsCommand } from '../command/create-settings.command';
import { CreateSettingsDto } from '../dto/create-settings.dto';
import { type UserDto } from '../dto/user.dto';
import { type UsersPageOptionsDto } from '../dto/users-page-options.dto';
import { UserEntity } from '../entity/user.entity';
import { UserSettingsEntity } from '../entity/user-settings.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: EntityRepository<UserEntity>,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
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
    const queryBuilder = this.em
      .createQueryBuilder(UserEntity, 'user')
      .leftJoinAndSelect('user.settings', 'settings');

    if (options.email) {
      await queryBuilder.orWhere({ email: options.email });
    }

    if (options.username) {
      await queryBuilder.orWhere({ username: options.username });
    }

    return queryBuilder.execute('get');
  }

  @EnsureRequestContext()
  async createUser(
    userRegisterDto: UserRegisterDto,
    file?: IFile,
  ): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      user.avatar = await this.awsS3Service.uploadImage(file);
    }

    await this.userRepository.insert(user);

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
    const queryBuilder = this.em.createQueryBuilder(UserEntity, 'user');
    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  @EnsureRequestContext()
  async createSettings(
    userId: Uuid,
    createSettingsDto: CreateSettingsDto,
  ): Promise<UserSettingsEntity> {
    const qb = this.em.createQueryBuilder(UserSettingsEntity, 'settings');

    return this.commandBus.execute<CreateSettingsCommand, UserSettingsEntity>(
      new CreateSettingsCommand(userId, createSettingsDto),
    );
  }
}
