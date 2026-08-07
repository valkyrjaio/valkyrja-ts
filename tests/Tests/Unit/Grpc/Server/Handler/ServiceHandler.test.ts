/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { CancellationToken } from '../../../../../../src/Valkyrja/Grpc/Message/Cancellation/CancellationToken.ts';
import { GrpcMessageServiceId } from '../../../../../../src/Valkyrja/Grpc/Message/Constant/GrpcMessageServiceId.ts';
import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';
import { StatusCode } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Status } from '../../../../../../src/Valkyrja/Grpc/Message/Status/Status.ts';
import { CallReceivedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/CallReceivedHandler.ts';
import { ResponseSentHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/ResponseSentHandler.ts';
import { SendingResponseHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/SendingResponseHandler.ts';
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/ThrowableCaughtHandler.ts';
import { ServiceHandler } from '../../../../../../src/Valkyrja/Grpc/Server/Handler/ServiceHandler.ts';
import { CancelledException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/CancelledException.ts';
import { ContainerFixture } from '../../../../Fixtures/Grpc/ContainerFixture.ts';
import { ServiceCallFixture } from '../../../../Fixtures/Grpc/Message/ServiceCallFixture.ts';
import { RecordingResponseSentMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RecordingResponseSentMiddlewareFixture.ts';
import { RespondingSendingResponseMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingSendingResponseMiddlewareFixture.ts';
import { RespondingThrowableCaughtMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingThrowableCaughtMiddlewareFixture.ts';
import { ShortCircuitCallReceivedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/ShortCircuitCallReceivedMiddlewareFixture.ts';
import { RouterFixture } from '../../../../Fixtures/Grpc/Routing/RouterFixture.ts';

const make = (
    router: RouterFixture,
    container: Container = new Container(),
    debug: boolean = false,
    callReceived: CallReceivedHandler = new CallReceivedHandler(container),
    throwableCaught: ThrowableCaughtHandler = new ThrowableCaughtHandler(container),
    sendingResponse: SendingResponseHandler = new SendingResponseHandler(container),
    responseSent: ResponseSentHandler = new ResponseSentHandler(container),
): ServiceHandler =>
    new ServiceHandler(container, router, callReceived, throwableCaught, sendingResponse, responseSent, debug);

describe('ServiceHandler', () => {
    describe('handle', () => {
        it('dispatches the router and publishes the response', async () => {
            const container = new Container();
            const expected = ServiceResponse.ok('payload');
            const router = new RouterFixture(expected);
            const call = ServiceCallFixture.make();

            const response = await make(router, container).handle(call);

            expect(response).toBe(expected);
            expect(router.dispatched).toBe(call);
            expect(container.getSingleton(GrpcMessageServiceId.ServiceResponseContract)).toBe(expected);
            expect(container.getSingleton(GrpcMessageServiceId.ServiceCallContract)).toBe(call);
        });

        it('short-circuits on a CallReceived response without reaching the router', async () => {
            const container = ContainerFixture.withMiddleware(ShortCircuitCallReceivedMiddlewareFixture) as Container;
            const router = new RouterFixture();
            const handler = make(
                router,
                container,
                false,
                new CallReceivedHandler(container, ShortCircuitCallReceivedMiddlewareFixture),
            );

            const response = await handler.handle(ServiceCallFixture.make());

            expect(response).toBe(ShortCircuitCallReceivedMiddlewareFixture.response);
            expect(router.dispatched).toBeNull();
        });

        it('fast-exits at entry when the call arrives already cancelled', async () => {
            const cancellation = new CancellationToken();

            cancellation.cancel(CancellationReason.DEADLINE_EXCEEDED);

            const router = new RouterFixture();
            const response = await make(router).handle(ServiceCallFixture.make(cancellation));

            expect(response.getStatus().getCode()).toBe(StatusCode.DEADLINE_EXCEEDED);
            expect(router.dispatched).toBeNull();
        });

        it('maps an uncaught throwable to INTERNAL', async () => {
            const response = await make(RouterFixture.throwing(new Error('boom'))).handle(ServiceCallFixture.make());

            expect(response.getStatus().getCode()).toBe(StatusCode.INTERNAL);
        });

        it('maps a cancelled exception to its reason', async () => {
            const deadline = await make(
                RouterFixture.throwing(new CancelledException('stopped', CancellationReason.DEADLINE_EXCEEDED)),
            ).handle(ServiceCallFixture.make());
            const client = await make(
                RouterFixture.throwing(new CancelledException('stopped', CancellationReason.CLIENT_CANCELLED)),
            ).handle(ServiceCallFixture.make());

            expect(deadline.getStatus().getCode()).toBe(StatusCode.DEADLINE_EXCEEDED);
            expect(client.getStatus().getCode()).toBe(StatusCode.CANCELLED);
        });

        it('runs the mapped response through ThrowableCaught middleware', async () => {
            const container = ContainerFixture.withMiddleware(RespondingThrowableCaughtMiddlewareFixture) as Container;
            const handler = make(
                RouterFixture.throwing(new Error('boom')),
                container,
                false,
                new CallReceivedHandler(container),
                new ThrowableCaughtHandler(container, RespondingThrowableCaughtMiddlewareFixture),
            );

            expect(await handler.handle(ServiceCallFixture.make())).toBe(
                RespondingThrowableCaughtMiddlewareFixture.response,
            );
        });

        it('rethrows in debug mode instead of mapping', async () => {
            const throwable = new Error('boom');
            const handler = make(RouterFixture.throwing(throwable), new Container(), true);

            await expect(handler.handle(ServiceCallFixture.make())).rejects.toBe(throwable);
        });
    });

    describe('sending', () => {
        it('runs the stage and republishes the response', async () => {
            const container = ContainerFixture.withMiddleware(RespondingSendingResponseMiddlewareFixture) as Container;
            const handler = make(
                new RouterFixture(),
                container,
                false,
                new CallReceivedHandler(container),
                new ThrowableCaughtHandler(container),
                new SendingResponseHandler(container, RespondingSendingResponseMiddlewareFixture),
            );

            const sent = await handler.sending(ServiceCallFixture.make(), ServiceResponse.ok());

            expect(sent).toBe(RespondingSendingResponseMiddlewareFixture.response);
            expect(container.getSingleton(GrpcMessageServiceId.ServiceResponseContract)).toBe(sent);
        });
    });

    describe('terminate', () => {
        beforeEach(() => {
            RecordingResponseSentMiddlewareFixture.sent.length = 0;
        });

        it('runs the ResponseSent stage', async () => {
            const container = ContainerFixture.withMiddleware(RecordingResponseSentMiddlewareFixture) as Container;
            const handler = make(
                new RouterFixture(),
                container,
                false,
                new CallReceivedHandler(container),
                new ThrowableCaughtHandler(container),
                new SendingResponseHandler(container),
                new ResponseSentHandler(container, RecordingResponseSentMiddlewareFixture),
            );

            await handler.terminate(ServiceCallFixture.make(), ServiceResponse.ok());

            expect(RecordingResponseSentMiddlewareFixture.sent).toEqual(['/pkg.Service/Method']);
        });
    });

    describe('run', () => {
        it('bundles handle then sending', async () => {
            const container = ContainerFixture.withMiddleware(RespondingSendingResponseMiddlewareFixture) as Container;
            const router = new RouterFixture(ServiceResponse.of(Status.notFound('missing')));
            const handler = make(
                router,
                container,
                false,
                new CallReceivedHandler(container),
                new ThrowableCaughtHandler(container),
                new SendingResponseHandler(container, RespondingSendingResponseMiddlewareFixture),
            );

            const response = await handler.run(ServiceCallFixture.make());

            expect(router.dispatched).not.toBeNull();
            expect(response).toBe(RespondingSendingResponseMiddlewareFixture.response);
        });
    });
});
