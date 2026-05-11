import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';
import type { RouteDispatchedHandlerContract } from '../Handler/Contract/RouteDispatchedHandlerContract.js';

export interface RouteDispatchedMiddlewareContract {
    routeDispatched(
        request: ServerRequestContract,
        response: ResponseContract,
        route: RouteContract,
        handler: RouteDispatchedHandlerContract
    ): ResponseContract;
}