/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteNotMatchedHandlerContract } from '../Handler/Contract/RouteNotMatchedHandlerContract.ts';

/** Middleware run when the service-map lookup finds no route. */
export interface RouteNotMatchedMiddlewareContract {
    routeNotMatched(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        handler: RouteNotMatchedHandlerContract,
    ): Promise<ServiceResponseContract>;
}

export namespace RouteNotMatchedMiddlewareContract {
    export function instanceOf(value: unknown): value is RouteNotMatchedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'routeNotMatched' in value;
    }
}
