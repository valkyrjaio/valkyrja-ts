/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ensureHttpRouteMetadata } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { Middleware } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/Middleware.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Http/Routing/Attribute/DecoratorContextFixture.ts';

import type { RouteMatchedMiddlewareContract } from '../../../../../../../src/Valkyrja/Http/Middleware/Contract/RouteMatchedMiddlewareContract.ts';

class CacheMiddleware {
    routeMatched(): never {
        throw new Error('not invoked');
    }
}

describe('Middleware attribute', () => {
    it('appends each middleware, in order, for the same method', () => {
        const context = methodDecoratorContext('welcomeCached');
        const middleware = CacheMiddleware as unknown as new (...args: unknown[]) => RouteMatchedMiddlewareContract;

        Middleware(middleware)(undefined, context);
        Middleware(middleware)(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('welcomeCached')?.middleware).toStrictEqual([
            middleware,
            middleware,
        ]);
    });
});
