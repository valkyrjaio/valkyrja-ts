import { RedirectResponse } from '../../../Message/Response/RedirectResponse.js';

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { RedirectResponseContract } from '../../../Message/Response/Contract/RedirectResponseContract.js';
import type { UriContract } from '../../../Message/Uri/Contract/UriContract.js';
import type { RequestReceivedMiddlewareContract } from '../../../Middleware/Contract/RequestReceivedMiddlewareContract.js';
import type { RequestReceivedHandlerContract } from '../../../Middleware/Handler/Contract/RequestReceivedHandlerContract.js';

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
