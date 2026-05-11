import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { RequestReceivedMiddlewareContract } from '../Contract/RequestReceivedMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { RequestReceivedHandlerContract } from './Contract/RequestReceivedHandlerContract.js';

export class RequestReceivedHandler extends Handler<RequestReceivedMiddlewareContract> implements RequestReceivedHandlerContract {
    requestReceived(request: ServerRequestContract): ResponseContract | ServerRequestContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware(next).requestReceived(request, this)
            : request;
    }
}