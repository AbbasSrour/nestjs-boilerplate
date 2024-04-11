import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import type { CreateSettingsDto } from '../dto/create-settings.dto.ts';
import { UserSettingsEntity } from '../entity/user-settings.entity.ts';

export class CreateSettingsCommand implements ICommand {
  constructor(
    public readonly userId: Uuid,
    public readonly createSettingsDto: CreateSettingsDto,
  ) {}
}

@CommandHandler(CreateSettingsCommand)
export class CreateSettingsHandler
  implements ICommandHandler<CreateSettingsCommand, UserSettingsEntity>
{
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingsRepository: EntityRepository<UserSettingsEntity>,
  ) {}

  async execute(command: CreateSettingsCommand) {
    const { userId, createSettingsDto } = command;
    const userSettingsEntity =
      // TODO: fix type cast
      // @ts-expect-error
      this.userSettingsRepository.create(createSettingsDto);

    userSettingsEntity.userId = userId;

    await this.userSettingsRepository.insert(userSettingsEntity);

    return userSettingsEntity;
  }
}
