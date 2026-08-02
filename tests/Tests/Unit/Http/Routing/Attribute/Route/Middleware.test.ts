/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ensureHttpRouteMetadata } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { Middleware } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/Middleware.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

import type { HttpMiddlewareClass } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';

class CacheMiddleware {
    routeMatched(): never {
        throw new Error('not invoked');
    }
}

describe('Middleware attribute', () => {
    it('appends each middleware, in order, for the same method', () => {
        const context = methodDecoratorContext('welcomeCached');
        const middleware = (): HttpMiddlewareClass => CacheMiddleware;

        Middleware(middleware)(undefined, context);
        Middleware(middleware)(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('welcomeCached')?.middleware).toStrictEqual([
            middleware,
            middleware,
        ]);
    });
});
