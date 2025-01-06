import { EntityGenerator } from '@mikro-orm/entity-generator';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import type { Options } from '@mikro-orm/postgresql';
import { PopulateHint, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SeedManager } from '@mikro-orm/seeder';
import dotenv from 'dotenv';

dotenv.config();

const config: Options = {
  driver: PostgreSqlDriver,
  name:"default",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  autoJoinOneToOneOwner: false,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  migrations: {
    transactional: true,
    snapshot: false,
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
    glob: '!(*.d).{js,ts}',
    // dropTables: this.isTest,
    generator: TSMigrationGenerator,
  },
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  dbName: process.env.DB_DATABASE,
  entities: [
    './dist/module/**/*.entity.js',
    './dist/module/**/entity/*.entity.js',
  ],
  entitiesTs: [
    './src/module/**/*.entity.ts',
    './src/module/**/entity/*.entity.ts',
  ],
  metadataProvider: TsMorphMetadataProvider,
  ignoreUndefinedInQuery: true,
  populateWhere: PopulateHint.INFER, // revert to v4 behaviour
  validate: true,
  strict: true,
  debug: true,
  forceUndefined: true,
  extensions: [Migrator, EntityGenerator, SeedManager],
};

export default config;
