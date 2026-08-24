/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteNotMatchedHandlerContract } from '../Handler/Contract/RouteNotMatchedHandlerContract.ts';

export interface RouteNotMatchedMiddlewareContract {
    routeNotMatched(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        handler: RouteNotMatchedHandlerContract,
    ): Promise<ServiceResponseContract>;
}

export namespace RouteNotMatchedMiddlewareContract {
    export function instanceOf(value: unknown): value is RouteNotMatchedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'routeNotMatched' in value;
    }
}
