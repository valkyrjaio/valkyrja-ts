/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { GrpcHandlerReference, GrpcMiddlewareReference } from './RouteAttributeMetadata.ts';

import type { MessageType } from '../Data/Contract/RouteContract.ts';

export interface GrpcRouteOptions<THandler = unknown> {
    /** The remote method's name, for example `SayHello`. */
    name: string;
    /**
     * The handler thunk and method name. See `GrpcHandlerReference`: the thunk defers the class
     * dereference past the decorator's temporal dead zone, and the generic constrains the method
     * name to a real handler on the referenced class.
     *
     * The argument is optional because `@RouteHandler` declares the same field, and that decorator
     * wins when a method carries both.
     */
    handler?: GrpcHandlerReference<THandler>;
    /** The message type the remote method accepts. */
    requestType?: MessageType;
    /** The message type the remote method answers with. */
    responseType?: MessageType;
    /** Whether the client streams more than one request message. */
    clientStreaming?: boolean;
    /** Whether the server streams more than one response message. */
    serverStreaming?: boolean;
    routeMatchedMiddleware?: GrpcMiddlewareReference[];
    routeDispatchedMiddleware?: GrpcMiddlewareReference[];
    throwableCaughtMiddleware?: GrpcMiddlewareReference[];
    sendingResponseMiddleware?: GrpcMiddlewareReference[];
    responseSentMiddleware?: GrpcMiddlewareReference[];
}
