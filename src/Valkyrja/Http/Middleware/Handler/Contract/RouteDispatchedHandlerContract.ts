/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.js';
import type { RouteDispatchedMiddlewareContract } from '../../Contract/RouteDispatchedMiddlewareContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface RouteDispatchedHandlerContract extends HandlerContract<RouteDispatchedMiddlewareContract> {
    routeDispatched(request: ServerRequestContract, response: ResponseContract, route: RouteContract): ResponseContract;
}
