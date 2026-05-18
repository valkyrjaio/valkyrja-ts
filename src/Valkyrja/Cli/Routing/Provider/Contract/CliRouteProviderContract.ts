import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface CliRouteProviderContract {
    getRoutes(): RouteContract[];
}

export namespace CliRouteProviderContract {
    export function instanceOf(value: unknown): value is CliRouteProviderContract {
        return typeof value === 'object' && value !== null && 'getRoutes' in value;
    }
}
