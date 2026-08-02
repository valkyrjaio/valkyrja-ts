/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
