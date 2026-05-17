import type { DynamicRouteContract } from '../../Data/Contract/DynamicRouteContract.js';
import type { RouteContract } from '../../Data/Contract/RouteContract.js';

export interface HttpRouteProviderContract {
    getRoutes(): Array<RouteContract | DynamicRouteContract>;
}

export namespace HttpRouteProviderContract {
    export function instanceOf(value: unknown): value is HttpRouteProviderContract {
        return typeof value === 'object' && value !== null && 'getRoutes' in value;
    }
}
