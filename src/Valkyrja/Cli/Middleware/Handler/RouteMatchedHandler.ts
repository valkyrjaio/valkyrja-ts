/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';
import type { RouteMatchedMiddlewareContract } from '../Contract/RouteMatchedMiddlewareContract.js';
import { Handler } from './Abstract/Handler.js';
import type { RouteMatchedHandlerContract } from './Contract/RouteMatchedHandlerContract.js';

export class RouteMatchedHandler extends Handler implements RouteMatchedHandlerContract {
    routeMatched(input: InputContract, route: RouteContract): RouteContract | OutputContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware<RouteMatchedMiddlewareContract>(next).routeMatched(input, route, this)
            : route;
    }
}
