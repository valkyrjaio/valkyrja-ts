/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { HttpMiddlewareReference } from '../RouteAttributeMetadata.ts';

/**
 * Add a middleware to the route(s) declared on a controller method.
 *
 * Mirrors PHP's repeatable `#[Middleware(CacheResponseMiddleware::class)]`. The
 * collector routes the class into whichever middleware buckets it satisfies.
 */
export function Middleware(middleware: HttpMiddlewareReference) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).middleware.push(middleware);
    };
}
