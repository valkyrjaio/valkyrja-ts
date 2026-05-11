import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { RouteNotMatchedMiddlewareContract } from '../Contract/RouteNotMatchedMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { RouteNotMatchedHandlerContract } from './Contract/RouteNotMatchedHandlerContract.js';

export class RouteNotMatchedHandler extends Handler<RouteNotMatchedMiddlewareContract> implements RouteNotMatchedHandlerContract {
    routeNotMatched(request: ServerRequestContract, response: ResponseContract): ResponseContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware(next).routeNotMatched(request, response, this)
            : response;
    }
}