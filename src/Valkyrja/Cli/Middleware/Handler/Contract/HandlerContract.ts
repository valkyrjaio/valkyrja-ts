/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
