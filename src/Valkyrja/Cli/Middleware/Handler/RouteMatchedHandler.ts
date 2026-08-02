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
import type { RouteMatchedMiddlewareContract } from '../Contract/RouteMatchedMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { RouteMatchedHandlerContract } from './Contract/RouteMatchedHandlerContract.ts';

export class RouteMatchedHandler extends Handler implements RouteMatchedHandlerContract {
    routeMatched(input: InputContract, route: RouteContract): RouteContract | OutputContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware<RouteMatchedMiddlewareContract>(next).routeMatched(input, route, this)
            : route;
    }
}
