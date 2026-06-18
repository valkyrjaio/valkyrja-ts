/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { DynamicRouteContract } from '../../Data/Contract/DynamicRouteContract.ts';
import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

export interface HttpRouteProviderContract {
    getRoutes(): Array<RouteContract | DynamicRouteContract>;
}

export namespace HttpRouteProviderContract {
    export function instanceOf(value: unknown): value is HttpRouteProviderContract {
        return typeof value === 'object' && value !== null && 'getRoutes' in value;
    }
}
