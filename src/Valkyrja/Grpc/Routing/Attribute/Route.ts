/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { createGrpcRouteDefinition, ensureGrpcMethodMetadata } from './RouteAttributeMetadata.ts';

import type { GrpcRouteOptions } from './RouteOptions.ts';

/**
 * Declare a gRPC route on a controller method.
 *
 * The decorator repeats. Stack it to answer more than one remote method from one controller
 * method. The enclosing `@Service` decorator declares the other part of the route's key.
 */
export function Route<THandler = unknown>(options: GrpcRouteOptions<THandler>) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureGrpcMethodMetadata(context.metadata, context.name).routes.push(createGrpcRouteDefinition(options));
    };
}
