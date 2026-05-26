/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
