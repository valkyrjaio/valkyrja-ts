/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
