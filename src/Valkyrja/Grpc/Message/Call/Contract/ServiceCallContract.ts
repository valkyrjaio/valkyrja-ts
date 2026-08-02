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

/**
 * The immutable inbound side of the wire: what the worker adapter hands to the kernel.
 *
 * Messages are typed agnostically as `unknown` (a single-element iterable for unary and
 * server-streaming calls, a lazy iterable for client-streaming). The concrete message type is the
 * per-application generated protobuf type and is never referenced by the framework.
 */
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
     * Get the decoded inbound messages. Under the buffered model this is the fixed list captured
     * before dispatch; under the streaming model it is a live stream whose iteration suspends until
     * each message arrives and ends when the client half-closes.
     *
     * Under the streaming model the stream also ends on cancellation — half-close and cancel both
     * terminate iteration identically. A handler that needs to tell an orderly end from a cancelled
     * one inspects {@link ServiceCallContract.getCancellation} after the loop.
     */
    getMessages(): InboundMessages;

    /**
     * Whether this call was dispatched under the streaming model (a bidirectional method). When
     * true, {@link ServiceCallContract.getMessages} is a live inbound stream and
     * {@link ServiceCallContract.send} pushes outbound messages while the handler runs; when false
     * (the buffered model) the handler instead returns a single `ServiceResponse` carrying its
     * messages.
     */
    isStreaming(): boolean;

    /**
     * Push one outbound message to the client from within the handler (streaming model only). Sends
     * are serialized; the framework fires `SendingResponse` middleware once, on the first send
     * (stream open). Not for buffered calls — those return their messages on the `ServiceResponse`
     * instead.
     *
     * Sends must not overlap. The transport is not safe against interleaving, so a push made while
     * another is still in flight is rejected fast rather than silently corrupting the stream — a
     * handler that fans work out must funnel its emissions back through one place.
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
     * Wrap a source iterable so iteration checks cancellation between items, exiting iteration early
     * (yielding no further items) once the call is cancelled. A cooperation helper for user handlers
     * and the outbound drain: it stops yielding rather than throwing, so a cancelled stream ends
     * cleanly. Handlers that want to fail loudly instead can call
     * `getCancellation().throwIfCancelled()`.
     */
    cancellable<T>(source: AsyncIterable<T>): AsyncIterable<T>;
    cancellable<T>(source: Iterable<T>): Iterable<T>;
}
