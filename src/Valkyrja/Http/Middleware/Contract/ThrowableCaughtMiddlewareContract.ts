import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.js';

export interface ThrowableCaughtMiddlewareContract {
    throwableCaught(
        request: ServerRequestContract,
        response: ResponseContract,
        throwable: Error,
        handler: ThrowableCaughtHandlerContract,
    ): ResponseContract;
}
