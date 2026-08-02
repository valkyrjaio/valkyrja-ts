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
import { RouteNotMatchedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/RouteNotMatchedHandler.ts';
import { RespondingRouteNotMatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingRouteNotMatchedMiddlewareFixture.ts';
import { ServiceCallFixture } from '../../../../Fixtures/Grpc/Message/ServiceCallFixture.ts';
import { ContainerFixture } from '../../../../Fixtures/Grpc/ContainerFixture.ts';

describe('RouteNotMatchedHandler', () => {
    it('passes the response through when there is no middleware', async () => {
        const response = ServiceResponse.ok();
        const handler = new RouteNotMatchedHandler(new Container());

        expect(await handler.routeNotMatched(ServiceCallFixture.make(), response)).toBe(response);
    });

    it('delegates to the next middleware', async () => {
        const container = ContainerFixture.withMiddleware(RespondingRouteNotMatchedMiddlewareFixture);
        const handler = new RouteNotMatchedHandler(container, RespondingRouteNotMatchedMiddlewareFixture);

        expect(await handler.routeNotMatched(ServiceCallFixture.make(), ServiceResponse.ok())).toBe(
            RespondingRouteNotMatchedMiddlewareFixture.response,
        );
    });

    it('fast-exits before the chain when the call is already cancelled', async () => {
        const cancellation = new CancellationToken();

        cancellation.cancel(CancellationReason.CLIENT_CANCELLED);

        const container = ContainerFixture.withMiddleware(RespondingRouteNotMatchedMiddlewareFixture);
        const handler = new RouteNotMatchedHandler(container, RespondingRouteNotMatchedMiddlewareFixture);
        const returned = await handler.routeNotMatched(ServiceCallFixture.make(cancellation), ServiceResponse.ok());

        expect(returned.getStatus().getCode()).toBe(StatusCode.CANCELLED);
    });

    it('fast-exits after the chain when the middleware returns a cancelled response', async () => {
        const container = new Container();

        container.setSingleton(RespondingRouteNotMatchedMiddlewareFixture.name, {
            routeNotMatched: () => Promise.resolve(ServiceResponse.cancelled(CancellationReason.DEADLINE_EXCEEDED)),
        });

        const handler = new RouteNotMatchedHandler(container, RespondingRouteNotMatchedMiddlewareFixture);
        const returned = await handler.routeNotMatched(ServiceCallFixture.make(), ServiceResponse.ok());

        expect(returned.getStatus().getCode()).toBe(StatusCode.DEADLINE_EXCEEDED);
    });
});
