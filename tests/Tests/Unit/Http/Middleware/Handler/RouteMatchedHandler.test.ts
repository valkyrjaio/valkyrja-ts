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
import { RouteMatchedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RouteMatchedHandler.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';
import type { RouteContract } from '../../../../../../src/Valkyrja/Http/Routing/Data/Contract/RouteContract.ts';

const request = {} as ServerRequestContract;
const route = {} as RouteContract;

class Mw {
    routeMatched = vi.fn(() => new Response());
}

describe('RouteMatchedHandler', () => {
    it('passes the route through when there is no middleware', () => {
        expect(new RouteMatchedHandler(new Container()).routeMatched(request, route)).toBe(route);
    });

    it('delegates to the next middleware', () => {
        const container = new Container();
        container.setSingleton(Mw.name, new Mw());

        expect(new RouteMatchedHandler(container, Mw).routeMatched(request, route)).toBeInstanceOf(Response);
    });
});
