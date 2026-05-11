import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { SendingResponseMiddlewareContract } from '../Contract/SendingResponseMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { SendingResponseHandlerContract } from './Contract/SendingResponseHandlerContract.js';

export class SendingResponseHandler extends Handler<SendingResponseMiddlewareContract> implements SendingResponseHandlerContract {
    sendingResponse(request: ServerRequestContract, response: ResponseContract): ResponseContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware(next).sendingResponse(request, response, this)
            : response;
    }
}