/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { DynamicRoute } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/DynamicRoute.ts';
import { ensureHttpRouteMetadata } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { methodDecoratorContext } from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('DynamicRoute attribute', () => {
    it('records a dynamic route definition with folded parameters', () => {
        const context = methodDecoratorContext('dynamic');

        DynamicRoute({
            path: '/{value}',
            name: 'dynamicValue',
            parameters: [{ name: 'value', regex: '[a-zA-Z]+' }],
        })(undefined, context);

        const route = ensureHttpRouteMetadata(context.metadata).methods.get('dynamic')?.routes[0];

        expect(route?.dynamic).toBe(true);
        expect(route?.parameters).toStrictEqual([{ name: 'value', regex: '[a-zA-Z]+' }]);
    });

    it('defaults parameters to an empty list when omitted', () => {
        const context = methodDecoratorContext('dynamic');

        DynamicRoute({ path: '/{value}', name: 'dynamicValue' })(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('dynamic')?.routes[0]?.parameters).toStrictEqual(
            [],
        );
    });
});
