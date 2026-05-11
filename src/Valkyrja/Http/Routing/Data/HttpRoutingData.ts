import type { DynamicRouteContract } from './Contract/DynamicRouteContract.js';
import type { RouteContract } from './Contract/RouteContract.js';

export type RequestMethodPaths = Partial<Record<string, Record<string, string>>>;

export class HttpRoutingData {
    constructor(
        public readonly routes: Record<string, () => RouteContract | DynamicRouteContract> = {},
        public readonly paths: RequestMethodPaths = {},
        public readonly dynamicPaths: RequestMethodPaths = {},
        public readonly regexes: RequestMethodPaths = {},
    ) {}
}