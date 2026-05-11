import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RequestReceivedMiddlewareContract } from '../../Contract/RequestReceivedMiddlewareContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface RequestReceivedHandlerContract extends HandlerContract<RequestReceivedMiddlewareContract> {
    requestReceived(request: ServerRequestContract): ResponseContract | ServerRequestContract;
}
