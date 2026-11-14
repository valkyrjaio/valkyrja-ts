/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Contract/RouteDispatchedMiddlewareContract.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface RouteDispatchedHandlerContract extends HandlerContract<RouteDispatchedMiddlewareContract> {
    routeDispatched(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        route: RouteContract,
    ): Promise<ServiceResponseContract>;
}
