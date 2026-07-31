/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../../../../src/Valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteMatchedResult } from '../../../../../src/Valkyrja/Grpc/Middleware/Data/RouteMatchedResult.ts';
import type { RouteMatchedHandlerContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';
import type { RouteContract } from '../../../../../src/Valkyrja/Grpc/Routing/Data/Contract/RouteContract.ts';

/** Continues the chain unchanged, so the handler walks on to the next middleware. */
export class PassThroughRouteMatchedMiddlewareFixture implements RouteMatchedMiddlewareContract {
    async routeMatched(
        call: ServiceCallContract,
        route: RouteContract,
        handler: RouteMatchedHandlerContract,
    ): Promise<RouteMatchedResult> {
        return handler.routeMatched(call, route);
    }
}
