import {
  PostgreSqlDriver,
  ReflectMetadataProvider,
  UnderscoreNamingStrategy,
} from '@mikro-orm/postgresql';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  driver: PostgreSqlDriver,
  namingStrategy: UnderscoreNamingStrategy,
  metadataProvider: ReflectMetadataProvider, // default metadata provider, TsMorphMetadataProviders an alternative
  entities: ['./dist/entities/**/*.js'], // path to your JS entities (dist), relative to `baseDir`
  entitiesTs: ['./src/entities/**/*.ts'], // path to your TS entities (source), relative to `baseDir`
};
