/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';
import type { RouteMatchedResult } from '../Data/RouteMatchedResult.ts';
import type { RouteMatchedHandlerContract } from '../Handler/Contract/RouteMatchedHandlerContract.ts';

/** Middleware run after a route is matched, before the user handler. */
export interface RouteMatchedMiddlewareContract {
    routeMatched(
        call: ServiceCallContract,
        route: RouteContract,
        handler: RouteMatchedHandlerContract,
    ): Promise<RouteMatchedResult>;
}

export namespace RouteMatchedMiddlewareContract {
    export function instanceOf(value: unknown): value is RouteMatchedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'routeMatched' in value;
    }
}
