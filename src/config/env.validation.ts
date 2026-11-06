import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

/**
 * Every environment variable the app uses, with its type and rules.
 * A property with a default value is optional; one without is required.
 */
export class EnvironmentVariables {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3000;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_DATABASE: string;

  @Transform(({ value }) => String(value).toLowerCase() === 'true')
  @IsBoolean()
  DB_SSL = false;
}

/** Runs once at startup (ConfigModule `validate`). Throws if anything is invalid. */
export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config);
  const errors = validateSync(env);

  if (errors.length > 0) {
    const messages = errors
      .map(
        (e) =>
          `  - ${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`,
      )
      .join('\n');
    throw new Error(`Invalid environment variables:\n${messages}`);
  }

  return env;
}
