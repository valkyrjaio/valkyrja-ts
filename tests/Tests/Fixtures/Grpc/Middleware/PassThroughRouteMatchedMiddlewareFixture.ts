/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../../../../src/Valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteMatchedResult } from '../../../../../src/Valkyrja/Grpc/Middleware/Data/RouteMatchedResult.ts';
import type { RouteMatchedHandlerContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';
import type { RouteContract } from '../../../../../src/Valkyrja/Grpc/Routing/Data/Contract/RouteContract.ts';

/** Continues the chain unchanged, so the handler walks on to the next middleware. */
export class PassThroughRouteMatchedMiddlewareFixture implements RouteMatchedMiddlewareContract {
    async routeMatched(
        call: ServiceCallContract,
        route: RouteContract,
        handler: RouteMatchedHandlerContract,
    ): Promise<RouteMatchedResult> {
        return handler.routeMatched(call, route);
    }
}
