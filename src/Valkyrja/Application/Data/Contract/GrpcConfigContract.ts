/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { CallReceivedMiddlewareContract } from '../../../Grpc/Middleware/Contract/CallReceivedMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../../Grpc/Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../../Grpc/Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../../Grpc/Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../../../Grpc/Middleware/Contract/RouteNotMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../../Grpc/Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../../Grpc/Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { ConfigContract } from './ConfigContract.ts';

/** Default cap on messages buffered per call before it is rejected. */
export const DEFAULT_MAX_INBOUND_MESSAGES = 1000;

export interface GrpcConfigContract extends ConfigContract {
    readonly port: number;

    /**
     * Upper bound on inbound messages per call. Under the buffered model (unary, server- and
     * client-streaming) it caps the total messages buffered before dispatch, rejecting an
     * over-limit call with `RESOURCE_EXHAUSTED`. Under the streaming (bidirectional) model it
     * instead bounds the in-flight window — the high-water mark for flow-control back-pressure, not
     * the total message count — so raising it there raises per-call memory pressure without ever
     * rejecting.
     */
    readonly maxInboundMessages: number;

    readonly callReceivedMiddleware: Array<new (...args: unknown[]) => CallReceivedMiddlewareContract>;
    readonly routeMatchedMiddleware: Array<new (...args: unknown[]) => RouteMatchedMiddlewareContract>;
    readonly routeNotMatchedMiddleware: Array<new (...args: unknown[]) => RouteNotMatchedMiddlewareContract>;
    readonly routeDispatchedMiddleware: Array<new (...args: unknown[]) => RouteDispatchedMiddlewareContract>;
    readonly throwableCaughtMiddleware: Array<new (...args: unknown[]) => ThrowableCaughtMiddlewareContract>;
    readonly sendingResponseMiddleware: Array<new (...args: unknown[]) => SendingResponseMiddlewareContract>;
    readonly responseSentMiddleware: Array<new (...args: unknown[]) => ResponseSentMiddlewareContract>;
}

export namespace GrpcConfigContract {
    export function instanceOf(value: unknown): value is GrpcConfigContract {
        return typeof value === 'object' && value !== null && 'maxInboundMessages' in value;
    }
}
