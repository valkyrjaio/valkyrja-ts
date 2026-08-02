/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { RedirectResponse } from '../../../Message/Response/RedirectResponse.ts';

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';
import type { RedirectResponseContract } from '../../../Message/Response/Contract/RedirectResponseContract.ts';
import type { UriContract } from '../../../Message/Uri/Contract/UriContract.ts';
import type { RequestReceivedMiddlewareContract } from '../../../Middleware/Contract/RequestReceivedMiddlewareContract.ts';
import type { RequestReceivedHandlerContract } from '../../../Middleware/Handler/Contract/RequestReceivedHandlerContract.ts';

export class RedirectTrailingSlashMiddleware implements RequestReceivedMiddlewareContract {
    requestReceived(
        request: ServerRequestContract,
        handler: RequestReceivedHandlerContract,
    ): ServerRequestContract | ResponseContract {
        if (this.shouldRedirectRequest(request)) {
            const uri = this.createBeforeRedirectUri(request.getUri());

            return this.createBeforeRedirectResponse(uri);
        }

        return handler.requestReceived(request);
    }

    protected shouldRedirectRequest(request: ServerRequestContract): boolean {
        const path = request.getUri().getPath();

        return path !== '/' && path.endsWith('/');
    }

    protected createBeforeRedirectUri(uri: UriContract): UriContract {
        const path = '/' + uri.getPath().replace(/^\/+|\/+$/g, '');
        return uri.withPath(path);
    }

    protected createBeforeRedirectResponse(uri: UriContract): RedirectResponseContract {
        return RedirectResponse.createFromUri(uri);
    }
}
