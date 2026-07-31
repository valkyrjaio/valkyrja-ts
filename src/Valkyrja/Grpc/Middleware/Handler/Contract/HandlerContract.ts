/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CallReceivedMiddlewareContract } from '../../Contract/CallReceivedMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Contract/ResponseSentMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteNotMatchedMiddlewareContract } from '../../Contract/RouteNotMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Contract/SendingResponseMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Contract/ThrowableCaughtMiddlewareContract.ts';

export type AnyMiddleware =
    | CallReceivedMiddlewareContract
    | RouteMatchedMiddlewareContract
    | RouteNotMatchedMiddlewareContract
    | RouteDispatchedMiddlewareContract
    | ThrowableCaughtMiddlewareContract
    | SendingResponseMiddlewareContract
    | ResponseSentMiddlewareContract;

export interface HandlerContract<Middleware extends AnyMiddleware = AnyMiddleware> {
    add(...middleware: Array<new (...args: unknown[]) => Middleware>): void;
}
