/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Response } from '../../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { ensureHttpRouteMetadata } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { RouteHandler } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RouteHandler.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

class HttpRouteProvider {
    static versionHandler(): Response {
        return Response.create('version');
    }
}

const handlerThunk = () => HttpRouteProvider;

describe('RouteHandler attribute', () => {
    it('stores the class thunk unevaluated so the class binding is never dereferenced', () => {
        let calls = 0;
        const context = methodDecoratorContext('version');

        RouteHandler([
            () => {
                calls++;

                return HttpRouteProvider;
            },
            'versionHandler',
        ])(undefined, context);

        expect(calls).toBe(0);
    });

    it('assigns the handler reference to the method metadata', () => {
        const context = methodDecoratorContext('version');

        RouteHandler([handlerThunk, 'versionHandler'])(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('version')?.handler).toStrictEqual([
            handlerThunk,
            'versionHandler',
        ]);
    });
});
