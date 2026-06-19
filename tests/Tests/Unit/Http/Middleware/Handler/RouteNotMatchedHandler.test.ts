/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { Response } from '../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { RouteNotMatchedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RouteNotMatchedHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';

const request = {} as ServerRequestContract;

class Mw {
    routeNotMatched = vi.fn(() => new Response());
}

describe('RouteNotMatchedHandler', () => {
    it('passes the response through when there is no middleware', () => {
        const response = new Response();

        expect(new RouteNotMatchedHandler(new Container()).routeNotMatched(request, response)).toBe(response);
    });

    it('delegates to the next middleware', () => {
        const container = new Container();
        const other = new Response();
        const middleware = new Mw();
        middleware.routeNotMatched.mockReturnValue(other);
        container.setSingleton(Mw.name, middleware);

        expect(new RouteNotMatchedHandler(container, Mw).routeNotMatched(request, new Response())).toBe(other);
    });
});
