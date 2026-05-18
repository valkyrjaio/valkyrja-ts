import type { ConfigContract } from './ConfigContract.js';

export interface CliConfigContract extends ConfigContract {
    readonly applicationName: string;
    readonly defaultCommandName: string;
    readonly inputReceivedMiddleware: string[];
    readonly routeMatchedMiddleware: string[];
    readonly routeNotMatchedMiddleware: string[];
    readonly routeDispatchedMiddleware: string[];
    readonly throwableCaughtMiddleware: string[];
    readonly exitedMiddleware: string[];
}

export namespace CliConfigContract {
    export function instanceOf(value: unknown): value is CliConfigContract {
        return typeof value === 'object' && value !== null && 'applicationName' in value;
    }
}
