import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { SendingResponseMiddlewareContract } from '../../Contract/SendingResponseMiddlewareContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface SendingResponseHandlerContract extends HandlerContract<SendingResponseMiddlewareContract> {
    sendingResponse(request: ServerRequestContract, response: ResponseContract): ResponseContract;
}
