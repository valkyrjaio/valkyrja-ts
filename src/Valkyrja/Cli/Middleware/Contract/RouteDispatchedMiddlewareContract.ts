/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';
import type { RouteDispatchedHandlerContract } from '../Handler/Contract/RouteDispatchedHandlerContract.ts';

export interface RouteDispatchedMiddlewareContract {
    routeDispatched(
        input: InputContract,
        output: OutputContract,
        route: RouteContract,
        handler: RouteDispatchedHandlerContract,
    ): OutputContract;
}

export namespace RouteDispatchedMiddlewareContract {
    export function instanceOf(value: unknown): value is RouteDispatchedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'routeDispatched' in value;
    }
}
