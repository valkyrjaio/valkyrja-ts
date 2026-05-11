import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { RouteNotMatchedHandlerContract } from '../Handler/Contract/RouteNotMatchedHandlerContract.js';

export interface RouteNotMatchedMiddlewareContract {
    routeNotMatched(
        request: ServerRequestContract,
        response: ResponseContract,
        handler: RouteNotMatchedHandlerContract
    ): ResponseContract;
}
