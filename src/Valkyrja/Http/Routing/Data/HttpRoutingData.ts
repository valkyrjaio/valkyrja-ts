/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { DynamicRouteContract } from './Contract/DynamicRouteContract.ts';
import type { RouteContract } from './Contract/RouteContract.ts';

export type RequestMethodPaths = Partial<Record<string, Record<string, string>>>;

export class HttpRoutingData {
    constructor(
        public readonly routes: Record<string, () => RouteContract | DynamicRouteContract> = {},
        public readonly paths: RequestMethodPaths = {},
        public readonly dynamicPaths: RequestMethodPaths = {},
        public readonly regexes: RequestMethodPaths = {},
    ) {}
}
