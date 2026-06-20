/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Http/Routing/Collection/RouteCollection.ts';
import { DynamicRoute } from '../../../../../../src/Valkyrja/Http/Routing/Data/DynamicRoute.ts';
import { Parameter } from '../../../../../../src/Valkyrja/Http/Routing/Data/Parameter.ts';
import { Route } from '../../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';
import { Matcher } from '../../../../../../src/Valkyrja/Http/Routing/Matcher/Matcher.ts';
import { HttpRoutingInvalidRoutePathException } from '../../../../../../src/Valkyrja/Http/Routing/Throwable/Exception/HttpRoutingInvalidRoutePathException.ts';
import { Cast } from '../../../../../../src/Valkyrja/Type/Data/Cast.ts';

import type { DynamicRouteContract } from '../../../../../../src/Valkyrja/Http/Routing/Data/Contract/DynamicRouteContract.ts';
import type { ResponseContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';

const handler = (): ResponseContract => ({}) as unknown as ResponseContract;

describe('Matcher', () => {
    it('matches a static route by normalized path', () => {
        const collection = new RouteCollection();
        collection.add(new Route('/users', 'users.index', handler, [RequestMethod.GET]));
        const matcher = new Matcher(collection);

        expect(matcher.match('users/', RequestMethod.GET)?.getName()).toBe('users.index');
        expect(matcher.match('/missing', RequestMethod.GET)).toBeNull();
    });

    it('matches a dynamic route and binds the captured value', () => {
        const collection = new RouteCollection();
        collection.add(
            new DynamicRoute(
                '/users/{id}',
                'users.show',
                '/users/(?<id>\\d+)',
                [new Parameter('id', '\\d+')],
                handler,
                [RequestMethod.GET],
            ),
        );
        const matcher = new Matcher(collection);

        const route = matcher.match('/users/42', RequestMethod.GET) as DynamicRouteContract;
        expect(route.getName()).toBe('users.show');
        expect(route.getParameters()[0]?.getValue()).toBe('42');
    });

    it('falls back to parameter defaults when the regex has no named groups', () => {
        const collection = new RouteCollection();
        collection.add(
            new DynamicRoute(
                '/users/{id}',
                'users.show',
                '/users/(\\d+)',
                [new Parameter('id', '\\d+', null, false, true, 'fallback')],
                handler,
                [RequestMethod.GET],
            ),
        );
        const matcher = new Matcher(collection);

        const route = matcher.match('/users/42', RequestMethod.GET) as DynamicRouteContract;
        expect(route.getParameters()[0]?.getValue()).toBe('fallback');
    });

    it('casts a captured value, converting it or returning the type object', () => {
        const typed = { asValue: () => 7 };
        const fakeType = { fromValue: () => typed };
        const collection = new RouteCollection();
        collection.add(
            new DynamicRoute(
                '/n/{n}',
                'n.show',
                '/n/(?<n>\\d+)',
                [new Parameter('n', '\\d+').withCast(new Cast(fakeType as unknown as string))],
                handler,
                [RequestMethod.GET],
            ),
        );
        collection.add(
            new DynamicRoute(
                '/m/{m}',
                'm.show',
                '/m/(?<m>\\d+)',
                [new Parameter('m', '\\d+').withCast(new Cast(fakeType as unknown as string, false))],
                handler,
                [RequestMethod.GET],
            ),
        );
        const matcher = new Matcher(collection);

        expect((matcher.match('/n/7', RequestMethod.GET) as DynamicRouteContract).getParameters()[0]?.getValue()).toBe(
            7,
        );
        expect((matcher.match('/m/7', RequestMethod.GET) as DynamicRouteContract).getParameters()[0]?.getValue()).toBe(
            typed,
        );
    });

    it('skips empty regexes while matching', () => {
        const collection = new RouteCollection();
        collection.add(
            new DynamicRoute('/empty', 'empty.show', '', [new Parameter('z', '.*')], handler, [RequestMethod.GET]),
        );
        collection.add(
            new DynamicRoute('/u/{id}', 'u.show', '/u/(?<id>\\d+)', [new Parameter('id', '\\d+')], handler, [
                RequestMethod.GET,
            ]),
        );
        const matcher = new Matcher(collection);

        expect((matcher.match('/u/9', RequestMethod.GET) as DynamicRouteContract).getName()).toBe('u.show');
    });

    it('keeps the parameter unchanged when there is no captured value', () => {
        const collection = new RouteCollection();
        collection.add(
            new DynamicRoute(
                '/items/{a}',
                'items.show',
                '/items(?:/(?<a>\\d+))?',
                [new Parameter('a', '\\d+', null, true)],
                handler,
                [RequestMethod.GET],
            ),
        );
        const matcher = new Matcher(collection);

        const route = matcher.match('/items', RequestMethod.GET) as DynamicRouteContract;
        expect(route.getParameters()[0]?.getValue()).toBeNull();
    });

    it('throws when a matching dynamic route has no parameters', () => {
        const collection = new RouteCollection();
        collection.add(new DynamicRoute('/x/{y}', 'x.show', '/x/(\\d+)', [], handler, [RequestMethod.GET]));
        const matcher = new Matcher(collection);

        expect(() => matcher.match('/x/5', RequestMethod.GET)).toThrow(HttpRoutingInvalidRoutePathException);
    });
});
