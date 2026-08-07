/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ContainerContract } from '../../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceResponseContract } from '../../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ResponseSentMiddlewareContract } from '../../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';

/** The handler that produces a response for a matched call. */
export type RouteHandler = (container: ContainerContract, route: RouteContract) => Promise<ServiceResponseContract>;

/** The generated protobuf message type a route carries, as a constructor reference. */
export type MessageType = new (...args: unknown[]) => object;

export interface RouteContract {
    /** Get the fully-qualified method, `/package.Service/Method` — the map key. */
    getMethod(): string;

    /** Get the service name, `package.Service`. */
    getService(): string;

    /** Get the bare method name, `Method`. */
    getMethodName(): string;

    /** Get the handler that produces a response for a matched call. */
    getHandler(): RouteHandler;

    /** Return a copy with the given handler. */
    withHandler(handler: RouteHandler): this;

    /** Get the generated protobuf request message type, or null if unspecified. */
    getRequestType(): MessageType | null;

    /** Return a copy with the given request type. */
    withRequestType(requestType: MessageType | null): this;

    /** Get the generated protobuf response message type, or null if unspecified. */
    getResponseType(): MessageType | null;

    /** Return a copy with the given response type. */
    withResponseType(responseType: MessageType | null): this;

    /** Whether the client streams multiple request messages. */
    isClientStreaming(): boolean;

    /** Return a copy with the given client-streaming flag. */
    withClientStreaming(clientStreaming: boolean): this;

    /** Whether the server streams multiple response messages. */
    isServerStreaming(): boolean;

    /** Return a copy with the given server-streaming flag. */
    withServerStreaming(serverStreaming: boolean): this;

    getRouteMatchedMiddleware(): Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>;

    withRouteMatchedMiddleware(...middleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>): this;

    withAddedRouteMatchedMiddleware(
        ...middleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>
    ): this;

    getRouteDispatchedMiddleware(): Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>;

    withRouteDispatchedMiddleware(
        ...middleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>
    ): this;

    withAddedRouteDispatchedMiddleware(
        ...middleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>
    ): this;

    getThrowableCaughtMiddleware(): Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>;

    withThrowableCaughtMiddleware(
        ...middleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>
    ): this;

    withAddedThrowableCaughtMiddleware(
        ...middleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>
    ): this;

    getSendingResponseMiddleware(): Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>;

    withSendingResponseMiddleware(
        ...middleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>
    ): this;

    withAddedSendingResponseMiddleware(
        ...middleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>
    ): this;

    getResponseSentMiddleware(): Array<new (...args: unknown[]) => ResponseSentMiddlewareContract>;

    withResponseSentMiddleware(...middleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract>): this;

    withAddedResponseSentMiddleware(
        ...middleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract>
    ): this;
}
