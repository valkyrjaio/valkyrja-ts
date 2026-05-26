/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RequestReceivedMiddlewareContract } from '../../Contract/RequestReceivedMiddlewareContract.js';
import type { RouteDispatchedMiddlewareContract } from '../../Contract/RouteDispatchedMiddlewareContract.js';
import type { RouteMatchedMiddlewareContract } from '../../Contract/RouteMatchedMiddlewareContract.js';
import type { RouteNotMatchedMiddlewareContract } from '../../Contract/RouteNotMatchedMiddlewareContract.js';
import type { SendingResponseMiddlewareContract } from '../../Contract/SendingResponseMiddlewareContract.js';
import type { TerminatedMiddlewareContract } from '../../Contract/TerminatedMiddlewareContract.js';
import type { ThrowableCaughtMiddlewareContract } from '../../Contract/ThrowableCaughtMiddlewareContract.js';

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
