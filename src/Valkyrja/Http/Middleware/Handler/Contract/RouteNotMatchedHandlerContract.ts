import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RouteNotMatchedMiddlewareContract } from '../../Contract/RouteNotMatchedMiddlewareContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface RouteNotMatchedHandlerContract extends HandlerContract<RouteNotMatchedMiddlewareContract> {
    routeNotMatched(request: ServerRequestContract, response: ResponseContract): ResponseContract;
}
