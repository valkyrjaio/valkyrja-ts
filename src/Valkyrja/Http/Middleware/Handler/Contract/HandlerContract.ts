/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RequestReceivedMiddlewareContract } from '../../Contract/RequestReceivedMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../../Contract/RouteNotMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Contract/SendingResponseMiddlewareContract.ts';
import type { TerminatedMiddlewareContract } from '../../Contract/TerminatedMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Contract/ThrowableCaughtMiddlewareContract.ts';

export type AnyMiddleware =
    | RequestReceivedMiddlewareContract
    | SendingResponseMiddlewareContract
    | RouteMatchedMiddlewareContract
    | RouteNotMatchedMiddlewareContract
    | RouteDispatchedMiddlewareContract
    | ThrowableCaughtMiddlewareContract
    | TerminatedMiddlewareContract;

export interface HandlerContract<Middleware extends AnyMiddleware = AnyMiddleware> {
    add(...middleware: Array<new (...args: unknown[]) => Middleware>): void;
}
