/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ServiceResponse } from '../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Status } from '../../../../../src/Valkyrja/Grpc/Message/Status/Status.ts';

import type { ServiceResponseContract } from '../../../../../src/Valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteDispatchedMiddlewareContract.ts';

/** Replaces the handler's response, proving the post-handler stage runs. */
export class RespondingRouteDispatchedMiddlewareFixture implements RouteDispatchedMiddlewareContract {
    static readonly response = ServiceResponse.of(Status.aborted('dispatched'));

    routeDispatched(): Promise<ServiceResponseContract> {
        return Promise.resolve(RespondingRouteDispatchedMiddlewareFixture.response);
    }
}
