import { GeneratorProvider } from '@provider/generator.provider';
import { Transform, TransformationType } from 'class-transformer';

export function S3UrlParser(): PropertyDecorator {
  return Transform((params) => {
    const key = params.value as string;

    switch (params.type) {
      case TransformationType.CLASS_TO_PLAIN: {
        return GeneratorProvider.getS3PublicUrl(key);
      }

      case TransformationType.PLAIN_TO_CLASS: {
        return GeneratorProvider.getS3Key(key);
      }

      default: {
        return key;
      }
    }
  });
}
