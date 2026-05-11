import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { SendingResponseHandlerContract } from '../Handler/Contract/SendingResponseHandlerContract.js';

export interface SendingResponseMiddlewareContract {
    sendingResponse(
        request: ServerRequestContract,
        response: ResponseContract,
        handler: SendingResponseHandlerContract
    ): ResponseContract;
}
