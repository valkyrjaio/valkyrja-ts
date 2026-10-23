/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Response } from '../../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { ensureHttpRouteMetadata } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { Handler } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/Handler.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

class HttpRouteProvider {
    static versionHandler(): Response {
        return Response.create('version');
    }
}

const handlerThunk = () => HttpRouteProvider;

describe('Handler attribute', () => {
    it('stores the class thunk unevaluated so the class binding is never dereferenced', () => {
        let calls = 0;
        const context = methodDecoratorContext('version');

        Handler([
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

        Handler([handlerThunk, 'versionHandler'])(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('version')?.handler).toStrictEqual([
            handlerThunk,
            'versionHandler',
        ]);
    });
});
