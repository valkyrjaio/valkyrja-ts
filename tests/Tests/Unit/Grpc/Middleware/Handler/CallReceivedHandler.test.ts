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
import { Deadline } from '../../../../../../src/Valkyrja/Grpc/Message/Deadline/Deadline.ts';
import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';
import { StatusCode } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { Metadata } from '../../../../../../src/Valkyrja/Grpc/Message/Metadata/Metadata.ts';
import { Peer } from '../../../../../../src/Valkyrja/Grpc/Message/Peer/Peer.ts';
import { ServiceCall } from '../../../../../../src/Valkyrja/Grpc/Message/Call/ServiceCall.ts';
import { CallReceivedHandler } from '../../../../../../src/Valkyrja/Grpc/Middleware/Handler/CallReceivedHandler.ts';
import { PassThroughCallReceivedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/PassThroughCallReceivedMiddlewareFixture.ts';
import { ShortCircuitCallReceivedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/ShortCircuitCallReceivedMiddlewareFixture.ts';

const callWith = (cancellation: CancellationToken = new CancellationToken()): ServiceCall =>
    new ServiceCall('/pkg.Service/Method', [], new Metadata(), Deadline.none(), cancellation, Peer.insecure('unknown'));

const containerWith = (...middleware: Array<new (...args: never[]) => object>): Container => {
    const container = new Container();

    for (const item of middleware) {
        container.setSingleton(item.name, new item());
    }

    return container;
};

describe('CallReceivedHandler', () => {
    it('passes the call through when there is no middleware', async () => {
        const call = callWith();
        const result = await new CallReceivedHandler(new Container()).callReceived(call);

        expect(result.call).toBe(call);
        expect(result.response).toBeNull();
    });

    it('delegates to the next middleware', async () => {
        const call = callWith();
        const container = containerWith(ShortCircuitCallReceivedMiddlewareFixture);
        const handler = new CallReceivedHandler(container, ShortCircuitCallReceivedMiddlewareFixture);

        const result = await handler.callReceived(call);

        expect(result.response).toBe(ShortCircuitCallReceivedMiddlewareFixture.response);
    });

    it('walks the whole chain when middleware delegates onward', async () => {
        const call = callWith();
        const container = containerWith(
            PassThroughCallReceivedMiddlewareFixture,
            ShortCircuitCallReceivedMiddlewareFixture,
        );
        const handler = new CallReceivedHandler(
            container,
            PassThroughCallReceivedMiddlewareFixture,
            ShortCircuitCallReceivedMiddlewareFixture,
        );

        const result = await handler.callReceived(call);

        expect(result.response).toBe(ShortCircuitCallReceivedMiddlewareFixture.response);
    });

    it('appends middleware added after construction', async () => {
        const call = callWith();
        const container = containerWith(ShortCircuitCallReceivedMiddlewareFixture);
        const handler = new CallReceivedHandler(container);

        handler.add(ShortCircuitCallReceivedMiddlewareFixture);

        const result = await handler.callReceived(call);

        expect(result.response).toBe(ShortCircuitCallReceivedMiddlewareFixture.response);
    });

    it('fast-exits before the chain when the call is already cancelled', async () => {
        const cancellation = new CancellationToken();

        cancellation.cancel(CancellationReason.DEADLINE_EXCEEDED);

        const call = callWith(cancellation);
        const container = containerWith(ShortCircuitCallReceivedMiddlewareFixture);
        const handler = new CallReceivedHandler(container, ShortCircuitCallReceivedMiddlewareFixture);

        const result = await handler.callReceived(call);

        expect(result.response?.getStatus().getCode()).toBe(StatusCode.DEADLINE_EXCEEDED);
    });

    it('fast-exits after the chain when cancellation fired during it', async () => {
        const cancellation = new CancellationToken();
        const call = callWith(cancellation);
        const container = new Container();

        container.setSingleton(PassThroughCallReceivedMiddlewareFixture.name, {
            callReceived: (received: ServiceCall) => {
                cancellation.cancel(CancellationReason.CLIENT_CANCELLED);

                return Promise.resolve({ call: received, response: null });
            },
        });

        const handler = new CallReceivedHandler(container, PassThroughCallReceivedMiddlewareFixture);
        const result = await handler.callReceived(call);

        expect(result.response?.getStatus().getCode()).toBe(StatusCode.CANCELLED);
    });
});
