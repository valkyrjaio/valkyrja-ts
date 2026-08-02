/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { HttpHandlerReference } from '../RouteAttributeMetadata.ts';

/**
 * Assign the handler for the route(s) declared on a controller method.
 *
 * Mirrors PHP's `#[RouteHandler([HttpRouteProvider::class, 'versionHandler'])]`,
 * written here as `@RouteHandler([() => HttpRouteProvider, 'versionHandler'])`.
 *
 * The two pieces of that shape solve two independent problems (see
 * `HttpHandlerReference`): the **thunk** keeps the class binding untouched at
 * decoration time so a circular or self-referential import cannot trip the
 * temporal dead zone, and the generic **`THandler`** makes the method name a
 * checked key of that class rather than an arbitrary string.
 */
export function RouteHandler<THandler>(handler: HttpHandlerReference<THandler>) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).handler = handler;
    };
}
