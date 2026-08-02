/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { CancellationToken } from '../../../../../../src/Valkyrja/Grpc/Message/Cancellation/CancellationToken.ts';
import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';
import { StatusCode } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { RouteMatchedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/RouteMatchedHandler.ts';
import { PassThroughRouteMatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/PassThroughRouteMatchedMiddlewareFixture.ts';
import { ShortCircuitRouteMatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/ShortCircuitRouteMatchedMiddlewareFixture.ts';
import { RouteFixture } from '../../../../Fixtures/Grpc/Routing/RouteFixture.ts';
import { ServiceCallFixture } from '../../../../Fixtures/Grpc/Message/ServiceCallFixture.ts';
import { ContainerFixture } from '../../../../Fixtures/Grpc/ContainerFixture.ts';

describe('RouteMatchedHandler', () => {
    it('passes the route through when there is no middleware', async () => {
        const route = RouteFixture.make();
        const result = await new RouteMatchedHandler(new Container()).routeMatched(ServiceCallFixture.make(), route);

        expect(result.route).toBe(route);
        expect(result.response).toBeNull();
    });

    it('delegates to the next middleware', async () => {
        const container = ContainerFixture.withMiddleware(ShortCircuitRouteMatchedMiddlewareFixture);
        const handler = new RouteMatchedHandler(container, ShortCircuitRouteMatchedMiddlewareFixture);

        const result = await handler.routeMatched(ServiceCallFixture.make(), RouteFixture.make());

        expect(result.response).toBe(ShortCircuitRouteMatchedMiddlewareFixture.response);
    });

    it('walks the whole chain when middleware delegates onward', async () => {
        const container = ContainerFixture.withMiddleware(
            PassThroughRouteMatchedMiddlewareFixture,
            ShortCircuitRouteMatchedMiddlewareFixture,
        );
        const handler = new RouteMatchedHandler(
            container,
            PassThroughRouteMatchedMiddlewareFixture,
            ShortCircuitRouteMatchedMiddlewareFixture,
        );

        const result = await handler.routeMatched(ServiceCallFixture.make(), RouteFixture.make());

        expect(result.response).toBe(ShortCircuitRouteMatchedMiddlewareFixture.response);
    });

    it('fast-exits before the chain when the call is already cancelled', async () => {
        const cancellation = new CancellationToken();

        cancellation.cancel(CancellationReason.CLIENT_CANCELLED);

        const container = ContainerFixture.withMiddleware(ShortCircuitRouteMatchedMiddlewareFixture);
        const handler = new RouteMatchedHandler(container, ShortCircuitRouteMatchedMiddlewareFixture);

        const result = await handler.routeMatched(ServiceCallFixture.make(cancellation), RouteFixture.make());

        expect(result.response?.getStatus().getCode()).toBe(StatusCode.CANCELLED);
    });

    it('fast-exits after the chain when cancellation fired during it', async () => {
        const cancellation = new CancellationToken();
        const route = RouteFixture.make();
        const container = new Container();

        container.setSingleton(PassThroughRouteMatchedMiddlewareFixture.name, {
            routeMatched: () => {
                cancellation.cancel(CancellationReason.DEADLINE_EXCEEDED);

                return Promise.resolve({ route, response: null });
            },
        });

        const handler = new RouteMatchedHandler(container, PassThroughRouteMatchedMiddlewareFixture);
        const result = await handler.routeMatched(ServiceCallFixture.make(cancellation), route);

        expect(result.response?.getStatus().getCode()).toBe(StatusCode.DEADLINE_EXCEEDED);
    });
});
