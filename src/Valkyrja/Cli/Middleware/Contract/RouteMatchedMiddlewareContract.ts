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
