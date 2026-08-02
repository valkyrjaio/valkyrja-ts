/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { LoggerContract } from '../../../../Log/Logger/Contract/LoggerContract.ts';
import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';

export class LogThrowableCaughtMiddleware implements ThrowableCaughtMiddlewareContract {
    constructor(protected readonly logger: LoggerContract) {}

    throwableCaught(
        request: ServerRequestContract,
        response: ResponseContract,
        throwable: Error,
        handler: ThrowableCaughtHandlerContract,
    ): ResponseContract {
        const url = request.getUri().getPath();
        const logMessage = `Http Server Error\nUrl: ${url}`;

        this.logger.throwable(throwable, logMessage);

        return handler.throwableCaught(request, response, throwable);
    }
}
