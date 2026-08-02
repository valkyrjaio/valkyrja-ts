/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { RouteNotMatchedHandlerContract } from '../Handler/Contract/RouteNotMatchedHandlerContract.ts';

export interface RouteNotMatchedMiddlewareContract {
    routeNotMatched(
        input: InputContract,
        output: OutputContract,
        handler: RouteNotMatchedHandlerContract,
    ): OutputContract;
}

export namespace RouteNotMatchedMiddlewareContract {
    export function instanceOf(value: unknown): value is RouteNotMatchedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'routeNotMatched' in value;
    }
}
