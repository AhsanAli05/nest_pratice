import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // TypeORM connects to PostgreSQL here. If the connection fails after
    // all retries, Nest logs the error and exits on its own.
    const app = await NestFactory.create(AppModule);

    // Close the app and database connections cleanly on Ctrl+C / SIGTERM.
    app.enableShutdownHooks();

    logger.log('PostgreSQL connected');

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`Application running on http://localhost:${port}`);
  } catch (error) {
    // Catches errors after startup begins, e.g. the port is already in use.
    logger.error(
      'Application failed to start',
      error instanceof Error ? error.stack : String(error),
    );
    process.exit(1);
  }
}

await bootstrap();
