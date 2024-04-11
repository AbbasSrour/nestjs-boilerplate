import { Module } from '@nestjs/common';

import { LangchainModule } from '../../packages/langchain/langchain.module';
import { ApiConfigService } from '../../packages/shared/services/api-config.service.ts';
import { SharedModule } from '../../packages/shared/shared.module.ts';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

const handlers = [];

@Module({
  imports: [
    LangchainModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory(config: ApiConfigService) {
        return {
          openAIKey: config.openAI.apiKey,
        };
      },
    }),
  ],
  controllers: [ChatbotController],
  exports: [ChatbotService],
  providers: [ChatbotService, ...handlers],
})
export class ChatbotModule {}
