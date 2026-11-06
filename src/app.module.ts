import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';


import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerMiddleware } from "./common/middleware/logger.middleware.js"

import { RequestIdMiddleware } from './common/middleware/RequestIdMiddleware.js';


import { databaseConfig } from './config/database.config.js';
import { validateEnv } from './config/env.validation.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)
      .forRoutes('*');
  }
}
