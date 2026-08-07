/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { GrpcHandlerReference, GrpcMiddlewareReference } from './RouteAttributeMetadata.ts';

export interface GrpcMethodOptions<THandler = unknown> {
    /** The RPC method name, for example `SayHello`. */
    name: string;
    /** Whether the client streams more than one request message. */
    clientStreaming?: boolean;
    /** Whether the server streams more than one response message. */
    serverStreaming?: boolean;
    /**
     * The handler thunk and method name. See `GrpcHandlerReference`: the thunk defers the class
     * dereference past the decorator's temporal dead zone, and the generic constrains the method
     * name to a real handler on the referenced class.
     */
    handler?: GrpcHandlerReference<THandler>;
    middleware?: GrpcMiddlewareReference[];
}
