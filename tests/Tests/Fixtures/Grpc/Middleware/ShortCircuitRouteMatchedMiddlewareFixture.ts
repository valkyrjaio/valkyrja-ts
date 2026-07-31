/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RouteMatchedResult } from '../../../../../src/Valkyrja/Grpc/Middleware/Data/RouteMatchedResult.ts';
import { ServiceResponse } from '../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Status } from '../../../../../src/Valkyrja/Grpc/Message/Status/Status.ts';

import type { ServiceCallContract } from '../../../../../src/Valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { RouteContract } from '../../../../../src/Valkyrja/Grpc/Routing/Data/Contract/RouteContract.ts';

/** Returns a response without calling the handler, short-circuiting the rest of the chain. */
export class ShortCircuitRouteMatchedMiddlewareFixture implements RouteMatchedMiddlewareContract {
    static readonly response = ServiceResponse.of(Status.permissionDenied('short circuit'));

    routeMatched(_call: ServiceCallContract, route: RouteContract): Promise<RouteMatchedResult> {
        return Promise.resolve(new RouteMatchedResult(route, ShortCircuitRouteMatchedMiddlewareFixture.response));
    }
}
