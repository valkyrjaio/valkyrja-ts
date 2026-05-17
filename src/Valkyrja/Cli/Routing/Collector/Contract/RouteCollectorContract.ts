import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface RouteCollectorContract {
    getRoutes(...classes: (new (...args: unknown[]) => unknown)[]): RouteContract[];
}

export namespace RouteCollectorContract {
    export function instanceOf(value: unknown): value is RouteCollectorContract {
        return typeof value === 'object' && value !== null && 'getRoutes' in value;
    }
}
