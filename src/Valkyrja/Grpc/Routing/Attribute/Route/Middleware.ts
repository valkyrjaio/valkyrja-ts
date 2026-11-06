/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureGrpcMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { GrpcMiddlewareReference } from '../RouteAttributeMetadata.ts';

/**
 * Add a middleware to the RPC methods declared on a controller method.
 *
 * The decorator repeats. The collector puts the class into every stage bucket that the class serves,
 * so one decorator serves every stage.
 */
export function Middleware(middleware: GrpcMiddlewareReference) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureGrpcMethodMetadata(context.metadata, context.name).middleware.push(middleware);
    };
}
