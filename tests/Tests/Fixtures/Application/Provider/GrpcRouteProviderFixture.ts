/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteContract } from '../../../../../src/Valkyrja/Grpc/Routing/Data/Contract/RouteContract.ts';
import type { GrpcRouteProviderContract } from '../../../../../src/Valkyrja/Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';

export class GrpcRouteProviderFixture implements GrpcRouteProviderContract {
    getRoutes(): RouteContract[] {
        return [];
    }
}
