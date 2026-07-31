/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Handler } from './Abstract/Handler.ts';

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteDispatchedHandlerContract } from './Contract/RouteDispatchedHandlerContract.ts';

/**
 * Walks the `RouteDispatched` chain with the two-question cancellation check bracketing each step.
 */
export class RouteDispatchedHandler
    extends Handler<RouteDispatchedMiddlewareContract>
    implements RouteDispatchedHandlerContract
{
    async routeDispatched(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        route: RouteContract,
    ): Promise<ServiceResponseContract> {
        const preCheck = this.checkCancellation(call, response);

        if (preCheck !== null) {
            return preCheck;
        }

        const next = this.next;

        if (next === null) {
            return response;
        }

        const returned = await this.getMiddleware(next).routeDispatched(call, response, route, this);
        const postCheck = this.checkCancellation(call, returned);

        return postCheck !== null ? postCheck : returned;
    }
}
