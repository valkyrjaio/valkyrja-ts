/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';
import type { RouteMatchedResult } from '../Data/RouteMatchedResult.ts';
import type { RouteMatchedHandlerContract } from '../Handler/Contract/RouteMatchedHandlerContract.ts';

/** Middleware run after a route is matched, before the user handler. */
export interface RouteMatchedMiddlewareContract {
    routeMatched(
        call: ServiceCallContract,
        route: RouteContract,
        handler: RouteMatchedHandlerContract,
    ): Promise<RouteMatchedResult>;
}

export namespace RouteMatchedMiddlewareContract {
    export function instanceOf(value: unknown): value is RouteMatchedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'routeMatched' in value;
    }
}
