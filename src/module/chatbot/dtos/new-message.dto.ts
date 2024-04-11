import { ClassField } from '../../../decorator/field/class-field.decorator.ts';
import { StringField } from '../../../decorator/field/string-field.decorator.ts';

export class MessageDto {
  @StringField()
  text!: string;

  @StringField()
  sender!: 'AI' | 'USER';
}

export class NewMessageDto {
  @ClassField(() => MessageDto, { each: true })
  messages!: MessageDto[];

  @StringField()
  text!: string;
}
