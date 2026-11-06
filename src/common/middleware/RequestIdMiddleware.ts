import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';

import type {
    NextFunction,
    Request,
    Response,
} from 'express';

import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        const requestId = randomUUID();

        res.locals.requestId = requestId;

        res.setHeader('X-Request-ID', requestId);

        next();
    }
}