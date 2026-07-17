/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpRouteProviderContract } from '../../../../../src/Valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';
import type { RouteContract } from '../../../../../src/Valkyrja/Http/Routing/Data/Contract/RouteContract.ts';
import type { DynamicRouteContract } from '../../../../../src/Valkyrja/Http/Routing/Data/Contract/DynamicRouteContract.ts';

export class HttpRouteProviderFixture implements HttpRouteProviderContract {
    getRoutes(): Array<RouteContract | DynamicRouteContract> {
        return [];
    }
}
