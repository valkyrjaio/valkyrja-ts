import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { RequestReceivedHandlerContract } from '../Handler/Contract/RequestReceivedHandlerContract.js';

export interface RequestReceivedMiddlewareContract {
    requestReceived(
        request: ServerRequestContract,
        handler: RequestReceivedHandlerContract
    ): ServerRequestContract | ResponseContract;
}
