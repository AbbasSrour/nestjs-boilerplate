import { Global, Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { I18nModule } from 'nestjs-i18n';
import { ApiConfigService } from './services/api-config.service';
// import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { TranslationService } from './services/translation.service';
import { ValidatorService } from './services/validator.service';

const providers: Provider[] = [
  ApiConfigService,
  ValidatorService,
  // AwsS3Service,
  GeneratorService,
  TranslationService,
];

@Global()
@Module({
  imports: [CqrsModule],
  providers,
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
