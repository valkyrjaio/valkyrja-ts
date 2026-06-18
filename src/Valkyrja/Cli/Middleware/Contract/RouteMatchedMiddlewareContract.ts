/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';
import type { RouteMatchedHandlerContract } from '../Handler/Contract/RouteMatchedHandlerContract.ts';

export interface RouteMatchedMiddlewareContract {
    routeMatched(
        input: InputContract,
        route: RouteContract,
        handler: RouteMatchedHandlerContract,
    ): RouteContract | OutputContract;
}

export namespace RouteMatchedMiddlewareContract {
    export function instanceOf(value: unknown): value is RouteMatchedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'routeMatched' in value;
    }
}
