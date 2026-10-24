/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureGrpcMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { GrpcHandlerReference } from '../RouteAttributeMetadata.ts';

/**
 * Assign the handler for the routes declared on a controller method.
 *
 * The handler is a single-valued field, so this decorator wins over the `handler` option on
 * `@Route`. See `GrpcHandlerReference` for the two pieces of the shape: the thunk keeps the class
 * binding untouched at decoration time, so a circular or self-referential import cannot trip the
 * temporal dead zone, and the generic makes the method name a checked key of that class.
 */
export function RouteHandler<THandler>(handler: GrpcHandlerReference<THandler>) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureGrpcMethodMetadata(context.metadata, context.name).handler = handler;
    };
}
