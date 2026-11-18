/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ServiceResponse } from '../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Route } from '../../../../../src/Valkyrja/Grpc/Routing/Data/Route.ts';

import type { RouteHandler } from '../../../../../src/Valkyrja/Grpc/Routing/Data/Contract/RouteContract.ts';

/** Builds gRPC routes for tests, defaulting to a handler that returns an empty OK response. */
export class RouteFixture {
    static make(method: string = '/pkg.Service/Method', handler: RouteHandler = RouteFixture.okHandler()): Route {
        return new Route(method, handler);
    }

    /** A handler that returns an OK response carrying the given message, if any. */
    static okHandler(message?: unknown): RouteHandler {
        return () => Promise.resolve(message === undefined ? ServiceResponse.ok() : ServiceResponse.ok(message));
    }
}
