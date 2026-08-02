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
import type { RouteDispatchedMiddlewareContract } from '../Contract/RouteDispatchedMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { RouteDispatchedHandlerContract } from './Contract/RouteDispatchedHandlerContract.ts';

export class RouteDispatchedHandler extends Handler implements RouteDispatchedHandlerContract {
    routeDispatched(input: InputContract, output: OutputContract, route: RouteContract): OutputContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware<RouteDispatchedMiddlewareContract>(next).routeDispatched(input, output, route, this)
            : output;
    }
}
