/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ProcessExitingMiddlewareContract } from '../../Contract/ProcessExitingMiddlewareContract.ts';
import type { InputReceivedMiddlewareContract } from '../../Contract/InputReceivedMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../../Contract/RouteNotMatchedMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Contract/ThrowableCaughtMiddlewareContract.ts';

export type AnyMiddlewareContract =
    | InputReceivedMiddlewareContract
    | RouteMatchedMiddlewareContract
    | RouteNotMatchedMiddlewareContract
    | RouteDispatchedMiddlewareContract
    | ThrowableCaughtMiddlewareContract
    | ProcessExitingMiddlewareContract;

export interface HandlerContract {
    add(...middleware: string[]): void;
}

export namespace HandlerContract {
    export function instanceOf(value: unknown): value is HandlerContract {
        return typeof value === 'object' && value !== null && 'add' in value;
    }
}
