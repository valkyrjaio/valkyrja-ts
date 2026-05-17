import type { ExitedMiddlewareContract } from '../../Contract/ExitedMiddlewareContract.js';
import type { InputReceivedMiddlewareContract } from '../../Contract/InputReceivedMiddlewareContract.js';
import type { RouteDispatchedMiddlewareContract } from '../../Contract/RouteDispatchedMiddlewareContract.js';
import type { RouteMatchedMiddlewareContract } from '../../Contract/RouteMatchedMiddlewareContract.js';
import type { RouteNotMatchedMiddlewareContract } from '../../Contract/RouteNotMatchedMiddlewareContract.js';
import type { ThrowableCaughtMiddlewareContract } from '../../Contract/ThrowableCaughtMiddlewareContract.js';

export type AnyMiddlewareContract =
    | InputReceivedMiddlewareContract
    | RouteMatchedMiddlewareContract
    | RouteNotMatchedMiddlewareContract
    | RouteDispatchedMiddlewareContract
    | ThrowableCaughtMiddlewareContract
    | ExitedMiddlewareContract;

export interface HandlerContract {
    add(...middleware: string[]): void;
}

export namespace HandlerContract {
    export function instanceOf(value: unknown): value is HandlerContract {
        return typeof value === 'object' && value !== null && 'add' in value;
    }
}
