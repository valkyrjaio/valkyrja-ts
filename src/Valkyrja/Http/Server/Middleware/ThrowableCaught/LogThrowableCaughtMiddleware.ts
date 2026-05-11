import type { LoggerContract } from '../../../../Log/Logger/Contract/LoggerContract.js';
import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { ThrowableCaughtMiddlewareContract } from '../../../Middleware/Contract/ThrowableCaughtMiddlewareContract.js';
import type { ThrowableCaughtHandlerContract } from '../../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.js';

export class LogThrowableCaughtMiddleware implements ThrowableCaughtMiddlewareContract {
    constructor(protected readonly logger: LoggerContract) {}

    throwableCaught(
        request: ServerRequestContract,
        response: ResponseContract,
        throwable: Error,
        handler: ThrowableCaughtHandlerContract
    ): ResponseContract {
        const url        = request.getUri().getPath();
        const logMessage = `Http Server Error\nUrl: ${url}`;

        this.logger.throwable(throwable, logMessage);

        return handler.throwableCaught(request, response, throwable);
    }
}