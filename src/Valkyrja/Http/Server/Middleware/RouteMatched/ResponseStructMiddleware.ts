import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { JsonResponseContract } from '../../../Message/Response/Contract/JsonResponseContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RouteDispatchedMiddlewareContract } from '../../../Middleware/Contract/RouteDispatchedMiddlewareContract.js';
import type { RouteDispatchedHandlerContract } from '../../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.js';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.js';
import type { ResponseStructContract } from '../../../Struct/Response/Contract/ResponseStructContract.js';

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
