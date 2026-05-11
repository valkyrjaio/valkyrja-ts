import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.js';
import type { RouteDispatchedMiddlewareContract } from '../../Contract/RouteDispatchedMiddlewareContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface RouteDispatchedHandlerContract extends HandlerContract<RouteDispatchedMiddlewareContract> {
    routeDispatched(request: ServerRequestContract, response: ResponseContract, route: RouteContract): ResponseContract;
}