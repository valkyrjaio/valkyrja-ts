import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';
import type { RouteMatchedHandlerContract } from '../Handler/Contract/RouteMatchedHandlerContract.js';

export interface RouteMatchedMiddlewareContract {
    routeMatched(
        request: ServerRequestContract,
        route: RouteContract,
        handler: RouteMatchedHandlerContract
    ): RouteContract | ResponseContract;
}
