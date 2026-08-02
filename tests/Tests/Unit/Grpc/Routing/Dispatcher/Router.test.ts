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
import { GrpcMessageServiceId } from '../../../../../../src/Valkyrja/Grpc/Message/Constant/GrpcMessageServiceId.ts';
import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { ResponseSentHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/ResponseSentHandler.ts';
import { RouteDispatchedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/RouteDispatchedHandler.ts';
import { RouteMatchedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/RouteNotMatchedHandler.ts';
import { SendingResponseHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/SendingResponseHandler.ts';
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/ThrowableCaughtHandler.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Grpc/Routing/Collection/RouteCollection.ts';
import { GrpcRoutingServiceId } from '../../../../../../src/Valkyrja/Grpc/Routing/Constant/GrpcRoutingServiceId.ts';
import { Router } from '../../../../../../src/Valkyrja/Grpc/Routing/Dispatcher/Router.ts';
import { RespondingRouteDispatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingRouteDispatchedMiddlewareFixture.ts';
import { RespondingRouteNotMatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingRouteNotMatchedMiddlewareFixture.ts';
import { RespondingSendingResponseMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingSendingResponseMiddlewareFixture.ts';
import { ShortCircuitRouteMatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/ShortCircuitRouteMatchedMiddlewareFixture.ts';
import { RouteFixture } from '../../../../Fixtures/Grpc/Routing/RouteFixture.ts';
import { ServiceCallFixture } from '../../../../Fixtures/Grpc/Message/ServiceCallFixture.ts';

import type { RouteContract } from '../../../../../../src/Valkyrja/Grpc/Routing/Data/Contract/RouteContract.ts';

interface Harness {
    router: Router;
    container: Container;
    collection: RouteCollection;
    sendingResponseHandler: SendingResponseHandler;
    responseSentHandler: ResponseSentHandler;
    throwableCaughtHandler: ThrowableCaughtHandler;
}

const harness = (...routes: RouteContract[]): Harness => {
    const container = new Container();
    const collection = new RouteCollection().add(...routes);
    const sendingResponseHandler = new SendingResponseHandler(container);
    const responseSentHandler = new ResponseSentHandler(container);
    const throwableCaughtHandler = new ThrowableCaughtHandler(container);

    const router = new Router(
        container,
        collection,
        new RouteMatchedHandler(container),
        new RouteNotMatchedHandler(container),
        new RouteDispatchedHandler(container),
        throwableCaughtHandler,
        sendingResponseHandler,
        responseSentHandler,
    );

    return { router, container, collection, sendingResponseHandler, responseSentHandler, throwableCaughtHandler };
};

describe('Router', () => {
    it('dispatches a matched route to its handler', async () => {
        const route = RouteFixture.make('/pkg.Service/Method', RouteFixture.okHandler('payload'));
        const { router } = harness(route);

        const response = await router.dispatch(ServiceCallFixture.make());

        expect(response.getStatus().getCode()).toBe(StatusCode.OK);
        expect([...response.getMessages()]).toEqual(['payload']);
    });

    it('answers UNIMPLEMENTED when the service map has no entry', async () => {
        const { router } = harness();

        const response = await router.dispatch(ServiceCallFixture.make());

        expect(response.getStatus().getCode()).toBe(StatusCode.UNIMPLEMENTED);
    });

    it('lets RouteNotMatched middleware replace the terminal response', async () => {
        const container = new Container();

        container.setSingleton(
            RespondingRouteNotMatchedMiddlewareFixture.name,
            new RespondingRouteNotMatchedMiddlewareFixture(),
        );

        const router = new Router(
            container,
            new RouteCollection(),
            new RouteMatchedHandler(container),
            new RouteNotMatchedHandler(container, RespondingRouteNotMatchedMiddlewareFixture),
            new RouteDispatchedHandler(container),
            new ThrowableCaughtHandler(container),
            new SendingResponseHandler(container),
            new ResponseSentHandler(container),
        );

        expect((await router.dispatch(ServiceCallFixture.make())).getStatus().getCode()).toBe(StatusCode.NOT_FOUND);
    });

    it('publishes the routed call and matched route as container singletons', async () => {
        const route = RouteFixture.make();
        const { router, container } = harness(route);

        await router.dispatch(ServiceCallFixture.make());

        expect(container.getSingleton(GrpcMessageServiceId.ServiceCallContract)).toBeDefined();
        expect(container.getSingleton(GrpcRoutingServiceId.RouteContract)).toBe(route);
    });

    it('registers the route middleware onto the shared stage handlers', async () => {
        const route = RouteFixture.make()
            .withAddedRouteDispatchedMiddleware(RespondingRouteDispatchedMiddlewareFixture)
            .withAddedSendingResponseMiddleware(RespondingSendingResponseMiddlewareFixture);
        const { router, container, sendingResponseHandler } = harness(route);

        container.setSingleton(
            RespondingRouteDispatchedMiddlewareFixture.name,
            new RespondingRouteDispatchedMiddlewareFixture(),
        );
        container.setSingleton(
            RespondingSendingResponseMiddlewareFixture.name,
            new RespondingSendingResponseMiddlewareFixture(),
        );

        const response = await router.dispatch(ServiceCallFixture.make());

        expect(response).toBe(RespondingRouteDispatchedMiddlewareFixture.response);

        // The router registered the per-route SendingResponse middleware onto the very handler the
        // ServiceHandler later uses — this is what breaks if the providers stop sharing singletons.
        expect(await sendingResponseHandler.sendingResponse(ServiceCallFixture.make(), ServiceResponse.ok())).toBe(
            RespondingSendingResponseMiddlewareFixture.response,
        );
    });

    it('short-circuits on a RouteMatched response without invoking the route handler', async () => {
        let invoked = false;
        const route = RouteFixture.make('/pkg.Service/Method', () => {
            invoked = true;

            return Promise.resolve(ServiceResponse.ok());
        });

        const container = new Container();

        container.setSingleton(
            ShortCircuitRouteMatchedMiddlewareFixture.name,
            new ShortCircuitRouteMatchedMiddlewareFixture(),
        );

        const router = new Router(
            container,
            new RouteCollection().add(route),
            new RouteMatchedHandler(container, ShortCircuitRouteMatchedMiddlewareFixture),
            new RouteNotMatchedHandler(container),
            new RouteDispatchedHandler(container),
            new ThrowableCaughtHandler(container),
            new SendingResponseHandler(container),
            new ResponseSentHandler(container),
        );

        expect(await router.dispatch(ServiceCallFixture.make())).toBe(
            ShortCircuitRouteMatchedMiddlewareFixture.response,
        );
        expect(invoked).toBe(false);
    });

    it('fast-exits before RouteMatched when the call is already cancelled', async () => {
        const cancellation = new CancellationToken();

        cancellation.cancel(CancellationReason.DEADLINE_EXCEEDED);

        const { router } = harness(RouteFixture.make());
        const response = await router.dispatch(ServiceCallFixture.make(cancellation));

        expect(response.getStatus().getCode()).toBe(StatusCode.DEADLINE_EXCEEDED);
    });

    it('fast-exits after the route handler when cancellation fired during it', async () => {
        const cancellation = new CancellationToken();
        const route = RouteFixture.make('/pkg.Service/Method', () => {
            cancellation.cancel(CancellationReason.CLIENT_CANCELLED);

            return Promise.resolve(ServiceResponse.ok());
        });
        const { router } = harness(route);

        const response = await router.dispatch(ServiceCallFixture.make(cancellation));

        expect(response.getStatus().getCode()).toBe(StatusCode.CANCELLED);
    });
});
