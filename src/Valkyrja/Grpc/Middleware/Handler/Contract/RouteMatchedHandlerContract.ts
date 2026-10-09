/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteMatchedResult } from '../../Data/RouteMatchedResult.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface RouteMatchedHandlerContract extends HandlerContract<RouteMatchedMiddlewareContract> {
    routeMatched(call: ServiceCallContract, route: RouteContract): Promise<RouteMatchedResult>;
}
