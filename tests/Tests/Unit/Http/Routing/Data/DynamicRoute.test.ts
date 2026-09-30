/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { DynamicRoute } from '../../../../../../src/Valkyrja/Http/Routing/Data/DynamicRoute.ts';
import { Parameter } from '../../../../../../src/Valkyrja/Http/Routing/Data/Parameter.ts';
import { HttpRoutingInvalidRouteParameterException } from '../../../../../../src/Valkyrja/Http/Routing/Throwable/Exception/HttpRoutingInvalidRouteParameterException.ts';

import type { ResponseContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';

const handler = (): ResponseContract => ({}) as unknown as ResponseContract;

describe('DynamicRoute', () => {
    it('exposes its regex and parameters immutably', () => {
        const parameter = new Parameter('id', '\\d+');
        const route = new DynamicRoute('/users/{id}', 'users.show', '/users/(\\d+)', [parameter], handler);

        expect(route.getRegex()).toBe('/users/(\\d+)');
        expect(route.getParameters()).toStrictEqual([parameter]);

        expect(route.withRegex('/x/(\\d+)').getRegex()).toBe('/x/(\\d+)');

        const other = new Parameter('slug', '[a-z]+');
        expect(route.withParameters(other).getParameters()).toStrictEqual([other]);
        expect(route.withAddedParameters(other).getParameters()).toHaveLength(2);
    });

    it('finds a parameter by name', () => {
        const id = new Parameter('id', '\\d+');
        const slug = new Parameter('slug', '[a-z]+');
        const route = new DynamicRoute('/users/{id}', 'users.show', '/users/(\\d+)', [id, slug], handler);

        expect(route.getParameter('id')).toBe(id);
        expect(route.getParameter('slug')).toBe(slug);
    });

    it('throws when no parameter carries the name', () => {
        const route = new DynamicRoute('/users/{id}', 'users.show', '/users/(\\d+)', [], handler);

        expect(() => route.getParameter('id')).toThrow(HttpRoutingInvalidRouteParameterException);
        expect(() => route.getParameter('id')).toThrow("No parameter named 'id' exists on this route");
    });

    it('reports whether a parameter carries the name', () => {
        const id = new Parameter('id', '\\d+');
        const route = new DynamicRoute('/users/{id}', 'users.show', '/users/(\\d+)', [id], handler);

        expect(route.hasParameter('id')).toBe(true);
        expect(route.hasParameter('slug')).toBe(false);
    });

    it('inherits the route name and path', () => {
        const route = new DynamicRoute('/users/{id}', 'users.show', '/users/(\\d+)', [], handler);

        expect(route.getName()).toBe('users.show');
        expect(route.getPath()).toBe('/users/{id}');
    });
});
