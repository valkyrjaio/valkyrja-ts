import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.js';
import type { RouteMatchedMiddlewareContract } from '../../Contract/RouteMatchedMiddlewareContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface RouteMatchedHandlerContract extends HandlerContract<RouteMatchedMiddlewareContract> {
    routeMatched(request: ServerRequestContract, route: RouteContract): RouteContract | ResponseContract;
}
