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
import type { RouteNotMatchedMiddlewareContract } from '../Contract/RouteNotMatchedMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { RouteNotMatchedHandlerContract } from './Contract/RouteNotMatchedHandlerContract.ts';

export class RouteNotMatchedHandler extends Handler implements RouteNotMatchedHandlerContract {
    routeNotMatched(input: InputContract, output: OutputContract): OutputContract {
        const next = this.next;

        return next !== null
            ? this.getMiddleware<RouteNotMatchedMiddlewareContract>(next).routeNotMatched(input, output, this)
            : output;
    }
}
