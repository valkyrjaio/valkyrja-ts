/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../Contract/RouteNotMatchedMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { RouteNotMatchedHandlerContract } from './Contract/RouteNotMatchedHandlerContract.ts';

export class RouteNotMatchedHandler
    extends Handler<RouteNotMatchedMiddlewareContract>
    implements RouteNotMatchedHandlerContract
{
    routeNotMatched(request: ServerRequestContract, response: ResponseContract): ResponseContract {
        const next = this.next;

        return next !== null ? this.getMiddleware(next).routeNotMatched(request, response, this) : response;
    }
}
