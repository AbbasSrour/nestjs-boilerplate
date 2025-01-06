import { Logger } from '@nestjs/common';
import inquirer from 'inquirer';
import { Command, CommandRunner } from 'nest-commander';

import { RoleType } from '../../constant/role-type';
import { UserRegisterDto } from '../../module/auth/dto/user-register.dto';
import { UserEntity } from '../../module/user/entity/user.entity';
import { UserService } from '../../module/user/user.service';

@Command({ name: 'create-user', description: 'Create a user' })
export class CreateUserCommand extends CommandRunner {
  protected readonly logger: Logger = new Logger('CommandRunner');

  constructor(private readonly userService: UserService) {
    super();
  }

  public async run(): Promise<void> {
    await this.createUserInteractive();
  }

  private async createUserInteractive() {
    const user: Partial<UserEntity> = {};
    const questions = [
      {
        type: 'input',
        name: 'firstName',
        message: 'first name: ',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'last name: ',
      },
      {
        type: 'input',
        name: 'email',
        message: 'email: ',
      },
      {
        type: 'password',
        message: 'password: ',
        name: 'password',
      },
      {
        type: 'password',
        message: 'confirm password: ',
        name: 'confirmPassword',
        mask: '*',
      },
      {
        type: 'input',
        message: 'phone number: ',
        name: 'phoneNumber',
        choices: ['true', 'false'],
      },
    ];

    const answers = await inquirer.prompt(questions);
    user.firstName = answers.firstName;
    user.lastName = answers.lastName;

    if (answers.password === answers.confirmPassword) {
      user.password = answers.password;
    } else {
      return;
    }

    user.phone = answers.phoneNumber;
    user.role = RoleType.ADMIN;
    user.email = answers.email;

    try {
      const createdUser = await this.userService.createUser(
        user as UserRegisterDto,
      );
      await this.userService.updateUser(createdUser.id, {
        email: 'anotheremail@gmail.com',
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
