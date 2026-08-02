/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { createHttpRouteDefinition, ensureHttpRouteMethodMetadata } from './RouteAttributeMetadata.ts';

import type { RouteOptions } from './RouteOptions.ts';

/**
 * Declare an HTTP route on a controller method.
 *
 * Mirrors PHP's repeatable `#[Route]` attribute: stack it to declare several
 * routes for one method. Sindri reads it statically to build the route cache;
 * in debug mode the runtime `AttributeRouteCollector` reads it from the class
 * metadata.
 *
 * Note: a path containing a `{parameter}` placeholder is automatically treated
 * as a dynamic route (mirroring PHP); supply the parameter definitions via the
 * `parameters` option. `@DynamicRoute` is an explicit alias for the same thing.
 */
export function Route<THandler = unknown>(options: RouteOptions<THandler>) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).routes.push(
            createHttpRouteDefinition(options, false),
        );
    };
}
