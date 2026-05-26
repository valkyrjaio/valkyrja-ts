/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';
import type { RouteMatchedMiddlewareContract } from '../Contract/RouteMatchedMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { RouteMatchedHandlerContract } from './Contract/RouteMatchedHandlerContract.js';

export class RouteMatchedHandler
    extends Handler<RouteMatchedMiddlewareContract>
    implements RouteMatchedHandlerContract
{
    routeMatched(request: ServerRequestContract, route: RouteContract): RouteContract | ResponseContract {
        const next = this.next;

        return next !== null ? this.getMiddleware(next).routeMatched(request, route, this) : route;
    }
}
