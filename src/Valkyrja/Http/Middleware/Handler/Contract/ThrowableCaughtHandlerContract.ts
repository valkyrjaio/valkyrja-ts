import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { ThrowableCaughtMiddlewareContract } from '../../Contract/ThrowableCaughtMiddlewareContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface ThrowableCaughtHandlerContract extends HandlerContract<ThrowableCaughtMiddlewareContract> {
    throwableCaught(request: ServerRequestContract, response: ResponseContract, throwable: Error): ResponseContract;
}