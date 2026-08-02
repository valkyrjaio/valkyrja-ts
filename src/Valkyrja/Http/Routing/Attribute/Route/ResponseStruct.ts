/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { ResponseStructContract } from '../../../Struct/Response/Contract/ResponseStructContract.ts';

/**
 * Assign the response struct for the route(s) declared on a controller method.
 *
 * Mirrors PHP's `#[ResponseStruct]`.
 */
export function ResponseStruct(struct: ResponseStructContract) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).responseStruct = struct;
    };
}
