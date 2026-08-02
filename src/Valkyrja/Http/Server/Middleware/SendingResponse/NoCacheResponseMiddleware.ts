/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { HeaderName } from '../../../Message/Constant/HeaderName.ts';
import { Header } from '../../../Message/Header/Header.ts';

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';
import type { SendingResponseMiddlewareContract } from '../../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { SendingResponseHandlerContract } from '../../../Middleware/Handler/Contract/SendingResponseHandlerContract.ts';

export class NoCacheResponseMiddleware implements SendingResponseMiddlewareContract {
    protected expires: string[] = ['Sun, 01 Jan 2014 00:00:00 GMT'];
    protected cacheControl: string[] = ['no-store', 'no-cache', 'must-revalidate', 'post-check=0', 'pre-check=0'];
    protected pragma: string[] = ['no-cache'];

    sendingResponse(
        request: ServerRequestContract,
        response: ResponseContract,
        handler: SendingResponseHandlerContract,
    ): ResponseContract {
        const headers = response
            .getHeaders()
            .withHeader(new Header(HeaderName.EXPIRES, ...this.expires))
            .withHeader(new Header(HeaderName.CACHE_CONTROL, ...this.cacheControl))
            .withHeader(new Header(HeaderName.PRAGMA, ...this.pragma));

        return handler.sendingResponse(request, response.withHeaders(headers));
    }
}
