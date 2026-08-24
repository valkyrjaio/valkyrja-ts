/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';
import type { RouteDispatchedHandlerContract } from '../Handler/Contract/RouteDispatchedHandlerContract.ts';

export interface RouteDispatchedMiddlewareContract {
    routeDispatched(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        route: RouteContract,
        handler: RouteDispatchedHandlerContract,
    ): Promise<ServiceResponseContract>;
}

export namespace RouteDispatchedMiddlewareContract {
    export function instanceOf(value: unknown): value is RouteDispatchedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'routeDispatched' in value;
    }
}
