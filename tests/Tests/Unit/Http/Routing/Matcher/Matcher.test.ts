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
import { Processor } from '../../../../../../src/Valkyrja/Http/Routing/Processor/Processor.ts';
import { Regex } from '../../../../../../src/Valkyrja/Http/Routing/Constant/Regex.ts';
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

    // -- End-to-end matching matrices (route built through the Processor) ----------------

    const processor = new Processor();

    function processed(
        path: string,
        name: string,
        parameters: Parameter[],
        methods: RequestMethod[] = [RequestMethod.GET],
    ): DynamicRoute {
        return processor.route(new DynamicRoute(path, name, '', parameters, handler, methods)) as DynamicRoute;
    }

    function paramValue(route: DynamicRouteContract, name: string): unknown {
        return route
            .getParameters()
            .find((parameter) => parameter.getName() === name)
            ?.getValue();
    }

    it.each([
        [Regex.NUM, '123', 'abc'],
        [Regex.ALPHA, 'abc', 'abc1'],
        [Regex.ALPHA_LOWERCASE, 'abc', 'Abc'],
        [Regex.ALPHA_UPPERCASE, 'ABC', 'abc'],
        [Regex.ALPHA_NUM, 'abc123', 'abc-1'],
        [Regex.ALPHA_NUM_UNDERSCORE, 'abc_123', 'abc-1'],
        [Regex.SLUG, 'My-slug-1', 'has_underscore'],
        [Regex.ANY, 'anything-1.x', null],
        [Regex.UUID, '66a39476-b630-4b95-8bfb-355f3d4843c5', 'not-a-uuid'],
        [Regex.UUID_V4, '78cbd961-d07b-4ef9-89a7-b4ec9d1a70f0', '11111111-1111-1111-1111-111111111111'],
        [Regex.ULID, '01KYGBV64MKWPK63CC1QH0VGF7', 'notaulid'],
        [Regex.VLID_V4, '04YHJMN6F5XHM497ZW', 'notavlid'],
    ])('matches a valid value and rejects an invalid one for a %s parameter', (typeRegex, valid, invalid) => {
        const collection = new RouteCollection();
        collection.add(processed('/{value}', 'typed', [new Parameter('value', typeRegex)]));
        const matcher = new Matcher(collection);

        const matched = matcher.match(`/${valid}`, RequestMethod.GET) as DynamicRouteContract | null;
        expect(matched).not.toBeNull();
        expect(paramValue(matched as DynamicRouteContract, 'value')).toBe(valid);

        if (invalid !== null) {
            expect(matcher.match(`/${invalid}`, RequestMethod.GET)).toBeNull();
        }
    });

    it('filters a dynamic route by request method', () => {
        const collection = new RouteCollection();
        collection.add(processed('/{name}', 'get-only', [new Parameter('name', Regex.ALPHA)], [RequestMethod.GET]));
        const matcher = new Matcher(collection);

        expect(matcher.match('/foo', RequestMethod.GET)).not.toBeNull();
        expect(matcher.match('/foo', RequestMethod.POST)).toBeNull();
    });

    it('filters a static route by request method', () => {
        const collection = new RouteCollection();
        collection.add(new Route('/only-get', 'get-only-static', handler, [RequestMethod.GET]));
        const matcher = new Matcher(collection);

        expect(matcher.match('/only-get', RequestMethod.GET)?.getName()).toBe('get-only-static');
        expect(matcher.match('/only-get', RequestMethod.POST)).toBeNull();
    });

    it('normalizes a trailing slash before matching', () => {
        const collection = new RouteCollection();
        collection.add(new Route('/foo', 'foo-static', handler, [RequestMethod.GET]));
        collection.add(processed('/bar/{x}', 'bar-dynamic', [new Parameter('x', Regex.ALPHA)]));
        const matcher = new Matcher(collection);

        expect(matcher.match('/foo/', RequestMethod.GET)?.getName()).toBe('foo-static');
        expect(matcher.match('/bar/abc/', RequestMethod.GET)?.getName()).toBe('bar-dynamic');
    });

    it('prefers a static route over a dynamic route that would also match', () => {
        const collection = new RouteCollection();
        collection.add(new Route('/users', 'static-users', handler, [RequestMethod.GET]));
        collection.add(processed('/{name}', 'any-name', [new Parameter('name', Regex.ALPHA)]));
        const matcher = new Matcher(collection);

        expect(matcher.match('/users', RequestMethod.GET)?.getName()).toBe('static-users');
        expect(matcher.match('/other', RequestMethod.GET)?.getName()).toBe('any-name');
    });

    it('extracts multiple parameters', () => {
        const collection = new RouteCollection();
        collection.add(
            processed('/a/{x}/b/{y}', 'multi', [new Parameter('x', Regex.NUM), new Parameter('y', Regex.ALPHA)]),
        );
        const matcher = new Matcher(collection);

        const route = matcher.match('/a/12/b/two', RequestMethod.GET) as DynamicRouteContract;
        expect(paramValue(route, 'x')).toBe('12');
        expect(paramValue(route, 'y')).toBe('two');
    });

    it('does not bind a non-capturing parameter', () => {
        const collection = new RouteCollection();
        collection.add(processed('/{nc}', 'non-capture', [new Parameter('nc', Regex.ALPHA, null, false, false)]));
        const matcher = new Matcher(collection);

        const route = matcher.match('/abc', RequestMethod.GET) as DynamicRouteContract;
        expect(paramValue(route, 'nc')).toBeNull();
    });
});
