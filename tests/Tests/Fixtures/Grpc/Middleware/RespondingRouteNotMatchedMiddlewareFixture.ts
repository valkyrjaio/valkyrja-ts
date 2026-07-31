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
import type { RouteNotMatchedMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/RouteNotMatchedMiddlewareContract.ts';

/** Substitutes its own response for the framework's `UNIMPLEMENTED` terminal. */
export class RespondingRouteNotMatchedMiddlewareFixture implements RouteNotMatchedMiddlewareContract {
    static readonly response = ServiceResponse.of(Status.notFound('no such method'));

    routeNotMatched(): Promise<ServiceResponseContract> {
        return Promise.resolve(RespondingRouteNotMatchedMiddlewareFixture.response);
    }
}
