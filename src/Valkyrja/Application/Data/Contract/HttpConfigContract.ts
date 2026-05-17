import type { ConfigContract } from './ConfigContract.js';

export interface HttpConfigContract extends ConfigContract {
    readonly requestReceivedMiddleware: string[];
    readonly routeMatchedMiddleware: string[];
    readonly routeNotMatchedMiddleware: string[];
    readonly routeDispatchedMiddleware: string[];
    readonly throwableCaughtMiddleware: string[];
    readonly sendingResponseMiddleware: string[];
    readonly terminatedMiddleware: string[];
}

export namespace HttpConfigContract {
    export function instanceOf(value: unknown): value is HttpConfigContract {
        return typeof value === 'object' && value !== null && 'requestReceivedMiddleware' in value;
    }
}
