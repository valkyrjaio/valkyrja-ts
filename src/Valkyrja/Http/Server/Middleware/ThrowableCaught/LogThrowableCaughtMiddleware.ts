/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
