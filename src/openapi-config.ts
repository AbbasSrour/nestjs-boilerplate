import * as fs from 'node:fs';
import path from 'node:path';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function setupOpenapi(app: INestApplication): void {
  const filePath = path.join(__dirname, 'openapi-description.txt');
  const apiDoc = fs.readFileSync(filePath, 'utf8');

  const documentBuilder = new DocumentBuilder()
    .setTitle('API')
    .setDescription(apiDoc)
    .addBearerAuth();

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());

  // Swagger
  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Scalar
  app.use(
    '/reference',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  console.info(
    `Documentation: http://localhost:${process.env.PORT}/documentation`,
  );
}
