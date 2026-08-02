/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { createHttpRouteDefinition, ensureHttpRouteMethodMetadata } from './RouteAttributeMetadata.ts';

import type { DynamicRouteOptions } from './RouteOptions.ts';

/**
 * Declare a dynamic HTTP route (one with path parameters) on a controller
 * method.
 *
 * Mirrors PHP's repeatable `#[DynamicRoute]` attribute. Because TC39 Stage-3
 * has no parameter decorators, the parameter definitions are folded into the
 * `parameters` option instead of PHP's separate `#[Parameter]` attribute.
 */
export function DynamicRoute<THandler = unknown>(options: DynamicRouteOptions<THandler>) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).routes.push(
            createHttpRouteDefinition(options, true),
        );
    };
}
