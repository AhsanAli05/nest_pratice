
import {
    Injectable,
    Logger,
    NestMiddleware,
} from '@nestjs/common';

import type {
    NextFunction,
    Request,
    Response,
} from 'express';

import { performance } from 'node:perf_hooks';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggerMiddleware.name);

    use(
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        const startTime = performance.now();

        res.on('finish', () => {
            const duration = Math.round(
                performance.now() - startTime,
            );

            const requestId = res.locals.requestId;

            this.logger.log(
                `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
            );
        });

        next();
    }
}
