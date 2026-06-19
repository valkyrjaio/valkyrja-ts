/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it, vi } from 'vitest';

import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { StatusCode } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { Response } from '../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Http/Routing/Collection/RouteCollection.ts';
import { Route } from '../../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';
import { Matcher } from '../../../../../../src/Valkyrja/Http/Routing/Matcher/Matcher.ts';
import { Router } from '../../../../../../src/Valkyrja/Http/Routing/Dispatcher/Router.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ResponseContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';
import type { ServerRequestContract } from '../../../../../../src/Valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';

function request(path: string, method: RequestMethod): ServerRequestContract {
    return {
        getUri: () => ({ getPath: () => path }),
        getMethod: () => method,
    } as unknown as ServerRequestContract;
}

function routerWith(...routes: Route[]): { router: Router; container: Container } {
    const collection = new RouteCollection();
    for (const route of routes) {
        collection.add(route);
    }
    const container = new Container();

    return { router: new Router(container, new Matcher(collection)), container };
}

describe('Router', () => {
    it('dispatches a matching route through its handler', () => {
        const response = new Response();
        const handler = vi.fn((): ResponseContract => response);
        const { router } = routerWith(new Route('/users', 'users.index', handler, [RequestMethod.GET]));

        expect(router.dispatch(request('/users', RequestMethod.GET))).toBe(response);
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('returns a 404 when no route matches', () => {
        const { router } = routerWith();

        expect(router.dispatch(request('/missing', RequestMethod.GET)).getStatusCode()).toBe(StatusCode.NOT_FOUND);
    });

    it('returns a 405 when the path matches only another method', () => {
        const handler = (): ResponseContract => new Response();
        const { router } = routerWith(new Route('/users', 'users.store', handler, [RequestMethod.POST]));

        expect(router.dispatch(request('/users', RequestMethod.GET)).getStatusCode()).toBe(
            StatusCode.METHOD_NOT_ALLOWED,
        );
    });

    it('returns early when route-matched middleware produces a response', () => {
        const earlyResponse = new Response();
        const routeMatchedHandler = {
            add: (): void => {},
            routeMatched: (): ResponseContract => earlyResponse,
        };
        const handler = vi.fn((): ResponseContract => new Response());

        const collection = new RouteCollection();
        collection.add(new Route('/x', 'x', handler, [RequestMethod.GET]));
        const router = new Router(
            new Container(),
            new Matcher(collection),
            undefined,
            undefined,
            routeMatchedHandler as never,
        );

        expect(router.dispatch(request('/x', RequestMethod.GET))).toBe(earlyResponse);
        expect(handler).not.toHaveBeenCalled();
    });
});
