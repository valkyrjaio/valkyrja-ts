/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import type { JsonResponseContract } from '../../../Message/Response/Contract/JsonResponseContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteDispatchedHandlerContract } from '../../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.ts';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.ts';
import type { ResponseStructContract } from '../../../Struct/Response/Contract/ResponseStructContract.ts';

export class ResponseStructMiddleware implements RouteDispatchedMiddlewareContract {
    routeDispatched(
        request: ServerRequestContract,
        response: ResponseContract,
        route: RouteContract,
        handler: RouteDispatchedHandlerContract,
    ): ResponseContract {
        if (route.hasResponseStruct() && this.isJsonResponse(response)) {
            const responseStruct = route.getResponseStruct();
            response = this.updateJsonWithResponseStruct(response, responseStruct);
        }

        return handler.routeDispatched(request, response, route);
    }

    protected isJsonResponse(response: ResponseContract): response is JsonResponseContract {
        return 'getBodyAsJson' in response;
    }

    protected updateJsonWithResponseStruct(
        response: JsonResponseContract,
        responseStruct: ResponseStructContract,
    ): JsonResponseContract {
        const data = response.getBodyAsJson();

        return response.withJsonAsBody(responseStruct.getStructuredData(data));
    }
}
