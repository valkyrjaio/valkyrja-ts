/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../../Contract/RouteNotMatchedMiddlewareContract.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface RouteNotMatchedHandlerContract extends HandlerContract<RouteNotMatchedMiddlewareContract> {
    routeNotMatched(request: ServerRequestContract, response: ResponseContract): ResponseContract;
}
