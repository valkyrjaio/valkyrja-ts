/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CancellationToken } from '../Cancellation/CancellationToken.ts';
import { Deadline } from '../Deadline/Deadline.ts';
import { Metadata } from '../Metadata/Metadata.ts';
import { Peer } from '../Peer/Peer.ts';
import { GrpcConcurrentSendException } from '../../Throwable/Exception/GrpcConcurrentSendException.ts';
import { GrpcNonStreamingSendException } from '../../Throwable/Exception/GrpcNonStreamingSendException.ts';

import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.ts';
import type { CancellationTokenContract } from '../Cancellation/Contract/CancellationTokenContract.ts';
import type { DeadlineContract } from '../Deadline/Contract/DeadlineContract.ts';
import type { MetadataContract } from '../Metadata/Contract/MetadataContract.ts';
import type { PeerContract } from '../Peer/Contract/PeerContract.ts';
import type { InboundMessages, ServiceCallContract } from './Contract/ServiceCallContract.ts';

/** The outbound push sink a streaming-model call emits through. */
export type OutboundSink = (message: unknown) => void;

export class ServiceCall implements ServiceCallContract {
    protected readonly method: string;
    protected readonly messages: InboundMessages;
    protected readonly metadata: MetadataContract;
    protected readonly deadline: DeadlineContract;
    protected readonly cancellation: CancellationTokenContract;
    protected readonly peer: PeerContract;
    protected readonly route: RouteContract | null;

    /** The outbound push sink for a streaming-model call; null for a buffered call. */
    protected readonly sink: OutboundSink | null;

    /** Guards against overlapping {@link ServiceCall.send} — the transport sink is not reentrant. */
    protected sending = false;

    constructor(
        method: string,
        messages: InboundMessages = [],
        metadata: MetadataContract = new Metadata(),
        deadline: DeadlineContract = Deadline.none(),
        cancellation: CancellationTokenContract = CancellationToken.never(),
        peer: PeerContract = Peer.insecure('unknown'),
        route: RouteContract | null = null,
        sink: OutboundSink | null = null,
    ) {
        this.method = method;
        this.messages = messages;
        this.metadata = metadata;
        this.deadline = deadline;
        this.cancellation = cancellation;
        this.peer = peer;
        this.route = route;
        this.sink = sink;
    }

    getMethod(): string {
        return this.method;
    }

    getMetadata(): MetadataContract {
        return this.metadata;
    }

    getDeadline(): DeadlineContract {
        return this.deadline;
    }

    getCancellation(): CancellationTokenContract {
        return this.cancellation;
    }

    getPeer(): PeerContract {
        return this.peer;
    }

    getMessages(): InboundMessages {
        return this.messages;
    }

    getRoute(): RouteContract | null {
        return this.route;
    }

    hasRoute(): boolean {
        return this.route !== null;
    }

    withRoute(route: RouteContract): ServiceCallContract {
        return new ServiceCall(
            this.method,
            this.messages,
            this.metadata,
            this.deadline,
            this.cancellation,
            this.peer,
            route,
            this.sink,
        );
    }

    isStreaming(): boolean {
        return this.sink !== null;
    }

    send(message: unknown): void {
        const sink = this.sink;

        if (sink === null) {
            throw new GrpcNonStreamingSendException(
                'send() is only available on a streaming (bidirectional) call; a buffered call returns its messages on the ServiceResponse instead.',
            );
        }

        // The transport sink is not reentrant, so overlapping sends race the wire framing and
        // corrupt the stream without a word.
        if (this.sending) {
            throw new GrpcConcurrentSendException(
                'Concurrent send() on a streaming call: a streaming handler must emit from a single place — sends are serialized and the transport is not reentrant.',
            );
        }

        this.sending = true;

        try {
            sink(message);
        } finally {
            this.sending = false;
        }
    }

    cancellable<T>(source: AsyncIterable<T>): AsyncIterable<T>;
    cancellable<T>(source: Iterable<T>): Iterable<T>;
    cancellable<T>(source: Iterable<T> | AsyncIterable<T>): Iterable<T> | AsyncIterable<T> {
        const cancellation = this.cancellation;

        if (Symbol.asyncIterator in source) {
            return {
                [Symbol.asyncIterator](): AsyncIterator<T> {
                    const delegate = source[Symbol.asyncIterator]();

                    return {
                        // A cancelled call stops yielding rather than throwing, so the drain closes
                        // normally instead of a CancelledException escaping the transport listener.
                        next: async (): Promise<IteratorResult<T>> => {
                            if (!cancellation.isCancelled()) {
                                return delegate.next();
                            }

                            // A consumer that receives `done` ends its loop normally and never calls
                            // `return()`, so the wrapper releases the source itself.
                            await delegate.return?.();

                            return { value: undefined, done: true };
                        },
                        // A `break` or a `throw` reaches the source through here, and the source may
                        // be a generator whose `finally` is the only thing that releases a resource.
                        return: async (value?: unknown): Promise<IteratorResult<T>> =>
                            (await delegate.return?.(value)) ?? { value: undefined, done: true },
                    };
                },
            };
        }

        return {
            [Symbol.iterator](): Iterator<T> {
                const delegate = source[Symbol.iterator]();

                return {
                    next: (): IteratorResult<T> => {
                        if (!cancellation.isCancelled()) {
                            return delegate.next();
                        }

                        delegate.return?.();

                        return { value: undefined, done: true };
                    },
                    // As above: an early exit reaches the wrapped source, or its cleanup never runs.
                    return: (value?: unknown): IteratorResult<T> =>
                        delegate.return?.(value) ?? { value: undefined, done: true },
                };
            },
        };
    }

    /** Convenience factory for a unary call carrying a single inbound message. */
    static unary(method: string, message: unknown): ServiceCall {
        return new ServiceCall(method, [message]);
    }
}
