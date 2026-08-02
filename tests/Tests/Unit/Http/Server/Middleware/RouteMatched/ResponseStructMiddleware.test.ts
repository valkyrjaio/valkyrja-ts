/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { JsonResponse } from '../../../../../../../src/Valkyrja/Http/Message/Response/JsonResponse.ts';
import { Response } from '../../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { RequestMethod } from '../../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { Route } from '../../../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';
import { ResponseStructMiddleware } from '../../../../../../../src/Valkyrja/Http/Server/Middleware/RouteMatched/ResponseStructMiddleware.ts';

import type { ServerRequestContract } from '../../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';
import type { RouteContract } from '../../../../../../../src/Valkyrja/Http/Routing/Data/Contract/RouteContract.ts';
import type { RouteDispatchedHandlerContract } from '../../../../../../../src/Valkyrja/Http/Middleware/Handler/Contract/RouteDispatchedHandlerContract.ts';
import type { ResponseStructContract } from '../../../../../../../src/Valkyrja/Http/Struct/Response/Contract/ResponseStructContract.ts';

const request = {} as ServerRequestContract;
const handler = {
    routeDispatched: (_request: ServerRequestContract, response: ResponseContract): ResponseContract => response,
} as unknown as RouteDispatchedHandlerContract;
const httpHandler = (): ResponseContract => new Response();

const responseStruct = {
    getStructuredData: (data: Record<string, unknown>) => ({ ...data, wrapped: true }),
} as unknown as ResponseStructContract;

function routeWithStruct(struct?: ResponseStructContract): RouteContract {
    let route = new Route('/x', 'x', httpHandler, [RequestMethod.GET]);
    if (struct) {
        route = route.withResponseStruct(struct);
    }

    return route;
}

describe('ResponseStructMiddleware', () => {
    it('applies the response struct to a JSON response', () => {
        const route = routeWithStruct(responseStruct);
        const response = new JsonResponse({ a: 1 });

        const result = new ResponseStructMiddleware().routeDispatched(
            request,
            response,
            route,
            handler,
        ) as JsonResponse;

        expect(result.getBodyAsJson()).toStrictEqual({ a: 1, wrapped: true });
    });

    it('passes through when the route has no response struct', () => {
        const response = new JsonResponse({ a: 1 });

        expect(new ResponseStructMiddleware().routeDispatched(request, response, routeWithStruct(), handler)).toBe(
            response,
        );
    });

    it('passes through a non-JSON response', () => {
        const response = new Response();

        expect(
            new ResponseStructMiddleware().routeDispatched(request, response, routeWithStruct(responseStruct), handler),
        ).toBe(response);
    });
});
