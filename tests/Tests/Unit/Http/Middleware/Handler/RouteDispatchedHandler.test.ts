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
import { RouteDispatchedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RouteDispatchedHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';
import type { RouteContract } from '../../../../../../src/Valkyrja/Http/Routing/Data/Contract/RouteContract.ts';

const request = {} as ServerRequestContract;
const route = {} as RouteContract;

class Mw {
    routeDispatched = vi.fn(() => new Response());
}

describe('RouteDispatchedHandler', () => {
    it('passes the response through when there is no middleware', () => {
        const response = new Response();

        expect(new RouteDispatchedHandler(new Container()).routeDispatched(request, response, route)).toBe(response);
    });

    it('delegates to the next middleware', () => {
        const container = new Container();
        container.setSingleton(Mw.name, new Mw());

        const other = new Response();
        const middleware = new Mw();
        middleware.routeDispatched.mockReturnValue(other);
        container.setSingleton(Mw.name, middleware);

        expect(new RouteDispatchedHandler(container, Mw).routeDispatched(request, new Response(), route)).toBe(other);
    });
});
