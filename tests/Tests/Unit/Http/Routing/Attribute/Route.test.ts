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
import { Route } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route.ts';
import { ensureHttpRouteMetadata } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { methodDecoratorContext } from '../../../../Fixtures/Http/Routing/Attribute/DecoratorContextFixture.ts';

describe('Route attribute', () => {
    it('records a route definition on the method metadata', () => {
        const context = methodDecoratorContext('version');

        Route({ path: '/version', name: 'version', requestMethods: [RequestMethod.GET] })(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('version')?.routes).toStrictEqual([
            {
                path: '/version',
                name: 'version',
                dynamic: false,
                handler: null,
                requestMethods: [RequestMethod.GET],
                parameters: [],
                middleware: [],
                requestStruct: null,
                responseStruct: null,
            },
        ]);
    });

    it('is repeatable, appending each definition for the same method', () => {
        const context = methodDecoratorContext('version');

        Route({ path: '/version', name: 'version' })(undefined, context);
        Route({ path: '/version', name: 'version.post', requestMethods: [RequestMethod.POST] })(undefined, context);

        expect(
            ensureHttpRouteMetadata(context.metadata)
                .methods.get('version')
                ?.routes.map((route) => route.name),
        ).toStrictEqual(['version', 'version.post']);
    });

    it('defaults request methods to an empty list when omitted', () => {
        const context = methodDecoratorContext('welcome');

        Route({ path: '/', name: 'welcome' })(undefined, context);

        expect(
            ensureHttpRouteMetadata(context.metadata).methods.get('welcome')?.routes[0]?.requestMethods,
        ).toStrictEqual([]);
    });
});
