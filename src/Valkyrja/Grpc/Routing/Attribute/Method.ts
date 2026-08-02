/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { createGrpcMethodDefinition, ensureGrpcMethodMetadata } from './RouteAttributeMetadata.ts';

import type { GrpcMethodOptions } from './RouteOptions.ts';

/**
 * Declare a gRPC RPC method on a controller method.
 *
 * The decorator repeats. Stack it to declare more than one RPC for one controller method. The
 * enclosing `@Service` decorator supplies the service name.
 */
export function Method<THandler = unknown>(options: GrpcMethodOptions<THandler>) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureGrpcMethodMetadata(context.metadata, context.name).methods.push(createGrpcMethodDefinition(options));
    };
}
