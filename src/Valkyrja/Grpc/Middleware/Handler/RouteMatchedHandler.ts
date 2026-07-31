/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RouteMatchedResult } from '../Data/RouteMatchedResult.ts';
import { Handler } from './Abstract/Handler.ts';

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';
import type { RouteMatchedMiddlewareContract } from '../Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteMatchedHandlerContract } from './Contract/RouteMatchedHandlerContract.ts';

/** Walks the `RouteMatched` chain with the two-question cancellation check bracketing each step. */
export class RouteMatchedHandler
    extends Handler<RouteMatchedMiddlewareContract>
    implements RouteMatchedHandlerContract
{
    async routeMatched(call: ServiceCallContract, route: RouteContract): Promise<RouteMatchedResult> {
        const preCheck = this.checkCancellation(call);

        if (preCheck !== null) {
            return new RouteMatchedResult(route, preCheck);
        }

        const next = this.next;

        if (next === null) {
            return new RouteMatchedResult(route);
        }

        const result = await this.getMiddleware(next).routeMatched(call, route, this);
        const postCheck = this.checkCancellation(call, result.response);

        if (postCheck !== null) {
            return new RouteMatchedResult(result.route, postCheck);
        }

        return result;
    }
}
