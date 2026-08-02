/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
