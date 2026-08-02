/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RequestReceivedMiddlewareContract } from '../../Contract/RequestReceivedMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../../Contract/RouteNotMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Contract/SendingResponseMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Contract/ResponseSentMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Contract/ThrowableCaughtMiddlewareContract.ts';

export type AnyMiddleware =
    | RequestReceivedMiddlewareContract
    | SendingResponseMiddlewareContract
    | RouteMatchedMiddlewareContract
    | RouteNotMatchedMiddlewareContract
    | RouteDispatchedMiddlewareContract
    | ThrowableCaughtMiddlewareContract
    | ResponseSentMiddlewareContract;

export interface HandlerContract<Middleware extends AnyMiddleware = AnyMiddleware> {
    add(...middleware: Array<new (...args: unknown[]) => Middleware>): void;
}
