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
import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { RouteDispatchedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/RouteDispatchedHandler.ts';
import { RespondingRouteDispatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingRouteDispatchedMiddlewareFixture.ts';
import { ServiceCallFixture } from '../../../../Fixtures/Grpc/Message/ServiceCallFixture.ts';
import { ContainerFixture } from '../../../../Fixtures/Grpc/ContainerFixture.ts';
import { RouteFixture } from '../../../../Fixtures/Grpc/Routing/RouteFixture.ts';

describe('RouteDispatchedHandler', () => {
    it('passes the response through when there is no middleware', async () => {
        const response = ServiceResponse.ok();
        const handler = new RouteDispatchedHandler(new Container());

        expect(await handler.routeDispatched(ServiceCallFixture.make(), response, RouteFixture.make())).toBe(response);
    });

    it('delegates to the next middleware', async () => {
        const container = ContainerFixture.withMiddleware(RespondingRouteDispatchedMiddlewareFixture);
        const handler = new RouteDispatchedHandler(container, RespondingRouteDispatchedMiddlewareFixture);

        expect(
            await handler.routeDispatched(ServiceCallFixture.make(), ServiceResponse.ok(), RouteFixture.make()),
        ).toBe(RespondingRouteDispatchedMiddlewareFixture.response);
    });

    it('fast-exits before the chain when the call is already cancelled', async () => {
        const cancellation = new CancellationToken();

        cancellation.cancel(CancellationReason.CLIENT_CANCELLED);

        const container = ContainerFixture.withMiddleware(RespondingRouteDispatchedMiddlewareFixture);
        const handler = new RouteDispatchedHandler(container, RespondingRouteDispatchedMiddlewareFixture);
        const returned = await handler.routeDispatched(
            ServiceCallFixture.make(cancellation),
            ServiceResponse.ok(),
            RouteFixture.make(),
        );

        expect(returned.getStatus().getCode()).toBe(StatusCode.CANCELLED);
    });

    it('fast-exits after the chain when the middleware returns a cancelled response', async () => {
        const container = new Container();

        container.setSingleton(RespondingRouteDispatchedMiddlewareFixture.name, {
            routeDispatched: () => Promise.resolve(ServiceResponse.cancelled(CancellationReason.DEADLINE_EXCEEDED)),
        });

        const handler = new RouteDispatchedHandler(container, RespondingRouteDispatchedMiddlewareFixture);
        const returned = await handler.routeDispatched(
            ServiceCallFixture.make(),
            ServiceResponse.ok(),
            RouteFixture.make(),
        );

        expect(returned.getStatus().getCode()).toBe(StatusCode.DEADLINE_EXCEEDED);
    });
});
