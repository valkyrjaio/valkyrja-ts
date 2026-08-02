/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../Contract/RouteDispatchedMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { RouteDispatchedHandlerContract } from './Contract/RouteDispatchedHandlerContract.ts';

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
