/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { RoutingResponseFactory } from '../../../../../../src/Valkyrja/Http/Routing/Factory/RoutingResponseFactory.ts';

import type { RedirectResponseContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Contract/RedirectResponseContract.ts';
import type { ResponseFactoryContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Factory/Contract/ResponseFactoryContract.ts';
import type { UrlContract } from '../../../../../../src/Valkyrja/Http/Routing/Url/Contract/UrlContract.ts';

describe('RoutingResponseFactory', () => {
    it('builds a redirect response from a named route url', () => {
        const redirect = {} as RedirectResponseContract;
        const url = { getUrl: vi.fn(() => '/users/5') } as unknown as UrlContract;
        const responseFactory = {
            createRedirectResponse: vi.fn(() => redirect),
        } as unknown as ResponseFactoryContract;

        const result = new RoutingResponseFactory(responseFactory, url).createRouteRedirectResponse('users.show', {
            id: 5,
        });

        expect(url.getUrl).toHaveBeenCalledWith('users.show', { id: 5 });
        expect(responseFactory.createRedirectResponse).toHaveBeenCalledWith('/users/5', undefined, undefined);
        expect(result).toBe(redirect);
    });
});
