import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { ThrowableCaughtMiddlewareContract } from '../Contract/ThrowableCaughtMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { ThrowableCaughtHandlerContract } from './Contract/ThrowableCaughtHandlerContract.js';

export class ThrowableCaughtHandler
    extends Handler<ThrowableCaughtMiddlewareContract>
    implements ThrowableCaughtHandlerContract
{
    throwableCaught(request: ServerRequestContract, response: ResponseContract, throwable: Error): ResponseContract {
        const next = this.next;

        return next !== null ? this.getMiddleware(next).throwableCaught(request, response, throwable, this) : response;
    }
}
