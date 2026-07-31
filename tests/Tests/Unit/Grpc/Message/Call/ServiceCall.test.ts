/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CancellationToken } from '../../../../../../src/Valkyrja/Grpc/Message/Cancellation/CancellationToken.ts';
import { Deadline } from '../../../../../../src/Valkyrja/Grpc/Message/Deadline/Deadline.ts';
import { AddressType } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/AddressType.ts';
import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';
import { Metadata } from '../../../../../../src/Valkyrja/Grpc/Message/Metadata/Metadata.ts';
import { AuthContext } from '../../../../../../src/Valkyrja/Grpc/Message/Peer/AuthContext.ts';
import { Peer } from '../../../../../../src/Valkyrja/Grpc/Message/Peer/Peer.ts';
import { ServiceCall } from '../../../../../../src/Valkyrja/Grpc/Message/Call/ServiceCall.ts';
import { InboundMessageStream } from '../../../../../../src/Valkyrja/Grpc/Message/Stream/InboundMessageStream.ts';
import { GrpcConcurrentSendException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/GrpcConcurrentSendException.ts';
import { GrpcNonStreamingSendException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/GrpcNonStreamingSendException.ts';
import { RouteFixture } from '../../../../Fixtures/Grpc/Routing/RouteFixture.ts';

describe('ServiceCall', () => {
    it('defaults every collaborator for a bare method', () => {
        const call = new ServiceCall('/pkg.Service/Method');

        expect(call.getMethod()).toBe('/pkg.Service/Method');
        expect([...(call.getMessages() as Iterable<unknown>)]).toEqual([]);
        expect([...call.getMetadata()]).toEqual([]);
        expect(call.getDeadline().hasDeadline()).toBe(false);
        expect(call.getCancellation().isCancelled()).toBe(false);
        expect(call.getPeer().getAddress()).toBe('unknown');
        expect(call.getPeer().getAddressType()).toBe(AddressType.UNKNOWN);
        expect(call.getPeer().getAuthContext().getType()).toBe(AuthContext.TYPE_INSECURE);
        expect(call.getRoute()).toBeNull();
        expect(call.hasRoute()).toBe(false);
        expect(call.isStreaming()).toBe(false);
    });

    it('exposes everything the adapter handed it', () => {
        const metadata = new Metadata().with('x-trace', 'a');
        const deadline = Deadline.fromAbsolute(1_000, () => 0);
        const cancellation = new CancellationToken();
        const peer = new Peer('1.2.3.4:5', AddressType.IPV4, AuthContext.insecure());
        const call = new ServiceCall('/pkg.Service/Method', ['one'], metadata, deadline, cancellation, peer);

        expect(call.getMetadata()).toBe(metadata);
        expect(call.getDeadline()).toBe(deadline);
        expect(call.getCancellation()).toBe(cancellation);
        expect(call.getPeer()).toBe(peer);
    });

    it('builds a unary call carrying one message', () => {
        const call = ServiceCall.unary('/pkg.Service/Method', 'payload');

        expect([...(call.getMessages() as Iterable<unknown>)]).toEqual(['payload']);
    });

    it('copies with the resolved route, preserving every other field', () => {
        const route = RouteFixture.make('/pkg.Service/Method');
        const cancellation = new CancellationToken();
        const call = new ServiceCall(
            '/pkg.Service/Method',
            ['one'],
            new Metadata().with('x-trace', 'a'),
            Deadline.none(),
            cancellation,
            Peer.insecure('unknown'),
        );
        const routed = call.withRoute(route);

        expect(routed.getRoute()).toBe(route);
        expect(routed.hasRoute()).toBe(true);
        expect(routed.getCancellation()).toBe(cancellation);
        expect(routed.getMetadata().get('x-trace')).toBe('a');
        expect(call.hasRoute()).toBe(false);
    });

    it('carries a live inbound stream under the streaming model', async () => {
        const stream = new InboundMessageStream();
        const call = new ServiceCall('/pkg.Service/Method', stream);

        stream.offer('one');
        stream.complete();

        const drained: unknown[] = [];

        for await (const message of call.getMessages() as AsyncIterable<unknown>) {
            drained.push(message);
        }

        expect(drained).toEqual(['one']);
    });

    describe('send', () => {
        it('rejects a push on a buffered call', () => {
            const call = new ServiceCall('/pkg.Service/Method');

            expect(() => {
                call.send('payload');
            }).toThrow(GrpcNonStreamingSendException);
        });

        it('pushes through the sink on a streaming call', () => {
            const sent: unknown[] = [];
            const call = new ServiceCall(
                '/pkg.Service/Method',
                [],
                new Metadata(),
                Deadline.none(),
                CancellationToken.never(),
                Peer.insecure('unknown'),
                null,
                (message) => sent.push(message),
            );

            expect(call.isStreaming()).toBe(true);

            call.send('one');
            call.send('two');

            expect(sent).toEqual(['one', 'two']);
        });

        it('rejects an overlapping push', () => {
            let overlapping: unknown = null;
            const call: ServiceCall = new ServiceCall(
                '/pkg.Service/Method',
                [],
                new Metadata(),
                Deadline.none(),
                CancellationToken.never(),
                Peer.insecure('unknown'),
                null,
                () => {
                    try {
                        call.send('reentrant');
                    } catch (thrown) {
                        overlapping = thrown;
                    }
                },
            );

            call.send('one');

            expect(overlapping).toBeInstanceOf(GrpcConcurrentSendException);
        });

        it('clears the in-flight guard when the sink throws', () => {
            const call: ServiceCall = new ServiceCall(
                '/pkg.Service/Method',
                [],
                new Metadata(),
                Deadline.none(),
                CancellationToken.never(),
                Peer.insecure('unknown'),
                null,
                () => {
                    throw new Error('sink failed');
                },
            );

            expect(() => {
                call.send('one');
            }).toThrow('sink failed');
            expect(() => {
                call.send('two');
            }).toThrow('sink failed');
        });
    });

    describe('cancellable', () => {
        it('yields every item of a synchronous source while the call is live', () => {
            const call = new ServiceCall('/pkg.Service/Method');

            expect([...call.cancellable(['one', 'two'])]).toEqual(['one', 'two']);
        });

        it('stops yielding from a synchronous source once cancelled', () => {
            const cancellation = new CancellationToken();
            const call = new ServiceCall(
                '/pkg.Service/Method',
                [],
                new Metadata(),
                Deadline.none(),
                cancellation,
                Peer.insecure('unknown'),
            );

            const yielded: unknown[] = [];

            for (const item of call.cancellable(['one', 'two', 'three'])) {
                yielded.push(item);

                cancellation.cancel(CancellationReason.CLIENT_CANCELLED);
            }

            expect(yielded).toEqual(['one']);
        });

        it('yields every item of an asynchronous source while the call is live', async () => {
            const call = new ServiceCall('/pkg.Service/Method');
            const stream = new InboundMessageStream();

            stream.offer('one');
            stream.offer('two');
            stream.complete();

            const yielded: unknown[] = [];

            for await (const item of call.cancellable(stream as AsyncIterable<unknown>)) {
                yielded.push(item);
            }

            expect(yielded).toEqual(['one', 'two']);
        });

        it('stops yielding from an asynchronous source once cancelled', async () => {
            const cancellation = new CancellationToken();
            const call = new ServiceCall(
                '/pkg.Service/Method',
                [],
                new Metadata(),
                Deadline.none(),
                cancellation,
                Peer.insecure('unknown'),
            );
            const stream = new InboundMessageStream();

            stream.offer('one');
            stream.offer('two');
            stream.complete();

            const yielded: unknown[] = [];

            for await (const item of call.cancellable(stream as AsyncIterable<unknown>)) {
                yielded.push(item);

                cancellation.cancel(CancellationReason.CLIENT_CANCELLED);
            }

            expect(yielded).toEqual(['one']);
        });
    });
});
