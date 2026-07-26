/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
 * Note: a path containing a `{parameter}` placeholder must be declared with
 * `@DynamicRoute` (which carries the parameter definitions), not `@Route` —
 * unlike PHP, `@Route` does not auto-promote `{`-paths to dynamic routes.
 */
export function Route(options: RouteOptions) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).routes.push(
            createHttpRouteDefinition(options, false),
        );
    };
}
