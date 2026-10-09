/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../../Contract/RouteNotMatchedMiddlewareContract.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface RouteNotMatchedHandlerContract extends HandlerContract<RouteNotMatchedMiddlewareContract> {
    routeNotMatched(call: ServiceCallContract, response: ServiceResponseContract): Promise<ServiceResponseContract>;
}
