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
import type { RouteMatchedMiddlewareContract } from '../Contract/RouteMatchedMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { RouteMatchedHandlerContract } from './Contract/RouteMatchedHandlerContract.ts';

export class RouteMatchedHandler
    extends Handler<RouteMatchedMiddlewareContract>
    implements RouteMatchedHandlerContract
{
    routeMatched(request: ServerRequestContract, route: RouteContract): RouteContract | ResponseContract {
        const next = this.next;

        return next !== null ? this.getMiddleware(next).routeMatched(request, route, this) : route;
    }
}
