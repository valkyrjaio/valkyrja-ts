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

    it('inherits the route name and path', () => {
        const route = new DynamicRoute('/users/{id}', 'users.show', '/users/(\\d+)', [], handler);

        expect(route.getName()).toBe('users.show');
        expect(route.getPath()).toBe('/users/{id}');
    });
});
