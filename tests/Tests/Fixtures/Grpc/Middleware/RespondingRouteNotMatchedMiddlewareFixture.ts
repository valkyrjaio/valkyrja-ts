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
import type { RouteNotMatchedMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteNotMatchedMiddlewareContract.ts';

/** Substitutes its own response for the framework's `UNIMPLEMENTED` terminal. */
export class RespondingRouteNotMatchedMiddlewareFixture implements RouteNotMatchedMiddlewareContract {
    static readonly response = ServiceResponse.of(Status.notFound('no such method'));

    routeNotMatched(): Promise<ServiceResponseContract> {
        return Promise.resolve(RespondingRouteNotMatchedMiddlewareFixture.response);
    }
}
