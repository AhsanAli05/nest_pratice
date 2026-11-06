import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentVariables } from './env.validation.js';

// Values are already validated and converted by validateEnv at startup.
export const databaseConfig = (
  config: ConfigService<EnvironmentVariables, true>,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST', { infer: true }),
  port: config.get('DB_PORT', { infer: true }),
  username: config.get('DB_USERNAME', { infer: true }),
  password: config.get('DB_PASSWORD', { infer: true }),
  database: config.get('DB_DATABASE', { infer: true }),

  autoLoadEntities: true,
  synchronize: false,

  // Wait up to ~15s for the database to become ready.
  retryAttempts: 5,
  retryDelay: 3000,

  // Encrypt AND verify the server certificate.
  ssl: config.get('DB_SSL', { infer: true })
    ? { rejectUnauthorized: true }
    : false,
});
