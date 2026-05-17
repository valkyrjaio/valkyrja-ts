import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';
import type { RouteDispatchedMiddlewareContract } from '../Contract/RouteDispatchedMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { RouteDispatchedHandlerContract } from './Contract/RouteDispatchedHandlerContract.js';

export class RouteDispatchedHandler
    extends Handler<RouteDispatchedMiddlewareContract>
    implements RouteDispatchedHandlerContract
{
    routeDispatched(
        request: ServerRequestContract,
        response: ResponseContract,
        route: RouteContract,
    ): ResponseContract {
        const next = this.next;

        return next !== null ? this.getMiddleware(next).routeDispatched(request, response, route, this) : response;
    }
}
