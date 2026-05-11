import type { ConfigContract } from './ConfigContract.js';

export interface CliConfigContract extends ConfigContract {
    readonly applicationName:            string;
    readonly defaultCommandName:         string;
    readonly inputReceivedMiddleware:    string[];
    readonly routeMatchedMiddleware:     string[];
    readonly routeNotMatchedMiddleware:  string[];
    readonly routeDispatchedMiddleware:  string[];
    readonly throwableCaughtMiddleware:  string[];
    readonly exitedMiddleware:           string[];
}
