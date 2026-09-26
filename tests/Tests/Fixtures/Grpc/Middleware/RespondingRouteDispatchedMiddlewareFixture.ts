/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ServiceResponse } from '../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Status } from '../../../../../src/Valkyrja/Grpc/Message/Status/Status.ts';

import type { ServiceResponseContract } from '../../../../../src/Valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteDispatchedMiddlewareContract.ts';

/** Replaces the handler's response, proving the post-handler stage runs. */
export class RespondingRouteDispatchedMiddlewareFixture implements RouteDispatchedMiddlewareContract {
    static readonly response = ServiceResponse.of(Status.aborted('dispatched'));

    routeDispatched(): Promise<ServiceResponseContract> {
        return Promise.resolve(RespondingRouteDispatchedMiddlewareFixture.response);
    }
}
