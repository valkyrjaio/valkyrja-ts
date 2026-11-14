/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.ts';
import type { CancellationTokenContract } from '../../Cancellation/Contract/CancellationTokenContract.ts';
import type { DeadlineContract } from '../../Deadline/Contract/DeadlineContract.ts';
import type { MetadataContract } from '../../Metadata/Contract/MetadataContract.ts';
import type { PeerContract } from '../../Peer/Contract/PeerContract.ts';

/**
 * The decoded inbound messages of a call: a fixed iterable under the buffered model, a live async
 * stream under the streaming model.
 */
export type InboundMessages = Iterable<unknown> | AsyncIterable<unknown>;

export interface ServiceCallContract {
    /** Get the fully-qualified method, `/package.Service/Method` — the service-map key. */
    getMethod(): string;

    /** Get the inbound metadata (request headers). */
    getMetadata(): MetadataContract;

    /** Get the call deadline. Never null; may be `Deadline.none()`. */
    getDeadline(): DeadlineContract;

    /** Get the cancellation token. Never null; may be `CancellationToken.never()`. */
    getCancellation(): CancellationTokenContract;

    /** Get the connection peer. Never null; auth may be `insecure`. */
    getPeer(): PeerContract;

    /**
     * Get the decoded inbound messages, as a fixed list when buffered and as a live stream when
     * streaming.
     *
     * A half-close and a cancellation end a stream alike, so a handler that must tell them apart
     * reads {@link ServiceCallContract.getCancellation} after the loop.
     */
    getMessages(): InboundMessages;

    /**
     * Whether this call was dispatched under the streaming model.
     *
     * A buffered handler returns one `ServiceResponse` instead of pushing messages.
     */
    isStreaming(): boolean;

    /**
     * Push one outbound message to the client from within a streaming handler.
     *
     * Sends are serialized, and `SendingResponse` middleware fires once, on the first send.
     *
     * @throws GrpcNonStreamingSendException if this call is not streaming
     * @throws GrpcConcurrentSendException if an overlapping send is detected
     */
    send(message: unknown): void;

    /** Get the resolved route, or null if the call has not yet been routed (or no route matched). */
    getRoute(): RouteContract | null;

    /** Whether a route has been resolved for this call. */
    hasRoute(): boolean;

    /** Return a copy with the resolved route set. */
    withRoute(route: RouteContract): ServiceCallContract;

    /**
     * Wrap a source iterable so iteration stops once the call is cancelled.
     *
     * It stops yielding rather than throwing, so a handler that wants to fail loudly calls
     * `getCancellation().throwIfCancelled()` instead.
     */
    cancellable<T>(source: AsyncIterable<T>): AsyncIterable<T>;
    cancellable<T>(source: Iterable<T>): Iterable<T>;
}
