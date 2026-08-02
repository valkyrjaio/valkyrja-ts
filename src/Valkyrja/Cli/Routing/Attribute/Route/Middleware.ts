/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureCliRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { CliMiddlewareReference } from '../RouteAttributeMetadata.ts';

/**
 * Add a middleware to the command(s) declared on a controller method.
 *
 * Mirrors PHP's repeatable `#[Middleware]`. The collector routes the class into
 * whichever middleware buckets it satisfies.
 */
export function Middleware(middleware: CliMiddlewareReference) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureCliRouteMethodMetadata(context.metadata, context.name).middleware.push(middleware);
    };
}
