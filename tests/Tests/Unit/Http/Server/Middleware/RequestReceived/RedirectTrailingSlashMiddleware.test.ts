/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RedirectResponse } from '../../../../../../../src/Valkyrja/Http/Message/Response/RedirectResponse.ts';
import { Scheme } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Enum/Scheme.ts';
import { Uri } from '../../../../../../../src/Valkyrja/Http/Message/Uri/Uri.ts';
import { RedirectTrailingSlashMiddleware } from '../../../../../../../src/Valkyrja/Http/Server/Middleware/RequestReceived/RedirectTrailingSlashMiddleware.ts';

import type { ServerRequestContract } from '../../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';
import type { RequestReceivedHandlerContract } from '../../../../../../../src/Valkyrja/Http/Middleware/Handler/Contract/RequestReceivedHandlerContract.ts';

const handler = {
    requestReceived: (request: ServerRequestContract): ServerRequestContract => request,
} as RequestReceivedHandlerContract;

function requestForPath(path: string): ServerRequestContract {
    return { getUri: () => new Uri(Scheme.HTTP, '', '', 'example.com', 0, path) } as unknown as ServerRequestContract;
}

describe('RedirectTrailingSlashMiddleware', () => {
    it('redirects a path with a trailing slash', () => {
        const result = new RedirectTrailingSlashMiddleware().requestReceived(requestForPath('/users/'), handler);

        expect(result).toBeInstanceOf(RedirectResponse);
    });

    it('passes through a path without a trailing slash', () => {
        const request = requestForPath('/users');

        expect(new RedirectTrailingSlashMiddleware().requestReceived(request, handler)).toBe(request);
    });

    it('passes through the root path', () => {
        const request = requestForPath('/');

        expect(new RedirectTrailingSlashMiddleware().requestReceived(request, handler)).toBe(request);
    });
});
