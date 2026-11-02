import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isSsl = configService.get<string>('DB_SSL') === 'true';

  return {
    type: 'postgres',
    host: configService.getOrThrow<string>('DB_HOST'),
    port: Number(configService.getOrThrow<string>('DB_PORT')),
    username: configService.getOrThrow<string>('DB_USERNAME'),
    password: configService.getOrThrow<string>('DB_PASSWORD'),
    database: configService.getOrThrow<string>('DB_DATABASE'),

    autoLoadEntities: true,
    synchronize: false,

    // Wait up to ~15s for the database to become ready.
    retryAttempts: 5,
    retryDelay: 3000,

    // Encrypt AND verify the server certificate.
    ssl: isSsl ? { rejectUnauthorized: true } : false,
  };
};
