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
import { HttpRoutingData } from '../../../../../../src/Valkyrja/Http/Routing/Data/HttpRoutingData.ts';
import { Parameter } from '../../../../../../src/Valkyrja/Http/Routing/Data/Parameter.ts';
import { Route } from '../../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';
import { HttpRoutingInvalidDynamicRouteNameException } from '../../../../../../src/Valkyrja/Http/Routing/Throwable/Exception/HttpRoutingInvalidDynamicRouteNameException.ts';
import { HttpRoutingInvalidRouteNameException } from '../../../../../../src/Valkyrja/Http/Routing/Throwable/Exception/HttpRoutingInvalidRouteNameException.ts';
import { HttpRoutingInvalidRoutePathException } from '../../../../../../src/Valkyrja/Http/Routing/Throwable/Exception/HttpRoutingInvalidRoutePathException.ts';
import { HttpRoutingInvalidRouteRegexException } from '../../../../../../src/Valkyrja/Http/Routing/Throwable/Exception/HttpRoutingInvalidRouteRegexException.ts';
import { CollectionClass } from '../../../../Classes/Http/Routing/Collection/CollectionClass.ts';

import type { ResponseContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';

const handler = (): ResponseContract => ({}) as unknown as ResponseContract;

function collectionWithRoutes(): RouteCollection {
    const collection = new RouteCollection();
    collection.add(new Route('/users', 'users.index', handler, [RequestMethod.GET]));
    collection.add(
        new DynamicRoute('/users/{id}', 'users.show', '/users/(\\d+)', [new Parameter('id', '\\d+')], handler, [
            RequestMethod.GET,
        ]),
    );
    collection.add(new Route('/any', 'any.route', handler, [RequestMethod.ANY]));

    return collection;
}

describe('RouteCollection', () => {
    it('resolves static routes by path and name', () => {
        const collection = collectionWithRoutes();

        expect(collection.hasPath('/users', RequestMethod.GET)).toBe(true);
        expect(collection.hasPath('/missing', RequestMethod.GET)).toBe(false);
        expect(collection.getByPath('/users', RequestMethod.GET).getName()).toBe('users.index');
        expect(() => collection.getByPath('/missing', RequestMethod.GET)).toThrow(HttpRoutingInvalidRoutePathException);

        expect(collection.hasName('users.index')).toBe(true);
        expect(collection.getByName('users.index').getName()).toBe('users.index');
        expect(() => collection.getByName('missing')).toThrow(HttpRoutingInvalidRouteNameException);
    });

    it('resolves dynamic routes by regex', () => {
        const collection = collectionWithRoutes();

        expect(collection.hasRegex('/users/(\\d+)', RequestMethod.GET)).toBe(true);
        expect(collection.getByRegex('/users/(\\d+)', RequestMethod.GET).getName()).toBe('users.show');
        expect(() => collection.getByRegex('/missing', RequestMethod.GET)).toThrow(
            HttpRoutingInvalidRouteRegexException,
        );
    });

    it('supports the ANY pseudo-method for lookups', () => {
        const collection = collectionWithRoutes();

        expect(collection.hasPath('/users', RequestMethod.ANY)).toBe(true);
        expect(collection.hasRegex('/users/(\\d+)', RequestMethod.ANY)).toBe(true);
        expect(collection.getByPath('/any', RequestMethod.POST).getName()).toBe('any.route');
        expect(collection.getByPath('/users', RequestMethod.ANY).getName()).toBe('users.index');
        expect(collection.getByRegex('/users/(\\d+)', RequestMethod.ANY).getName()).toBe('users.show');
        expect(Object.keys(collection.getPaths(RequestMethod.ANY))).toContain('/users');
        expect(Object.keys(collection.getRegexes(RequestMethod.ANY))).toContain('/users/(\\d+)');
        expect(() => collection.getByPath('/missing', RequestMethod.ANY)).toThrow(HttpRoutingInvalidRoutePathException);
        expect(() => collection.getByRegex('/missing', RequestMethod.ANY)).toThrow(
            HttpRoutingInvalidRouteRegexException,
        );
    });

    it('lists paths, regexes, and all routes for a method', () => {
        const collection = collectionWithRoutes();

        expect(collection.getPaths(RequestMethod.GET)).toHaveProperty('/users');
        expect(collection.getRegexes(RequestMethod.GET)).toHaveProperty('/users/(\\d+)');
        expect(collection.getAll(RequestMethod.GET)).toHaveProperty('users.index');
    });

    it('returns an empty record for a method with no registered paths', () => {
        const collection = new RouteCollection();
        collection.add(new Route('/users', 'users.index', handler, [RequestMethod.GET]));

        expect(collection.getPaths(RequestMethod.DELETE)).toStrictEqual({});
    });

    it('throws when stored data references an unknown route name', () => {
        const collection = new RouteCollection();
        collection.setFromData(new HttpRoutingData({}, { GET: { '/orphan': 'missingName' } }));

        expect(() => collection.getByPath('/orphan', RequestMethod.GET)).toThrow(HttpRoutingInvalidRouteNameException);
    });

    it('throws when a regex resolves to a non-dynamic route', () => {
        const collection = new RouteCollection();
        collection.setFromData(
            new HttpRoutingData(
                { staticName: () => new Route('/static', 'staticName', handler, [RequestMethod.GET]) },
                {},
                {},
                { GET: { '/re': 'staticName' } },
            ),
        );

        expect(() => collection.getByRegex('/re', RequestMethod.GET)).toThrow(
            HttpRoutingInvalidDynamicRouteNameException,
        );
    });

    it('round-trips through data', () => {
        const source = collectionWithRoutes();
        const data = source.getData();

        expect(data).toBeInstanceOf(HttpRoutingData);

        const target = new RouteCollection();
        target.setFromData(data);

        expect(target.getByName('users.index').getName()).toBe('users.index');
    });

    it('does not register a route when assigned directly to the ANY method', () => {
        const collection = new CollectionClass();
        const route = new Route('/direct', 'direct.route', handler, [RequestMethod.ANY]);
        const dynamicRoute = new DynamicRoute(
            '/direct/{id}',
            'direct.dynamic',
            '/direct/(\\d+)',
            [new Parameter('id', '\\d+')],
            handler,
            [RequestMethod.ANY],
        );

        collection.setRouteToRequestMethodWrapper(route, RequestMethod.ANY);
        collection.setRouteToRequestMethodWrapper(dynamicRoute, RequestMethod.ANY);

        expect(collection.hasPath('/direct', RequestMethod.ANY)).toBe(false);
        expect(collection.hasPath('/direct', RequestMethod.GET)).toBe(false);
        expect(collection.hasPath('/direct/{id}', RequestMethod.ANY)).toBe(false);
    });
});
