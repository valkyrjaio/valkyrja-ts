/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { RequestStructContract } from '../../../Struct/Request/Contract/RequestStructContract.ts';

/**
 * Assign the request struct for the route(s) declared on a controller method.
 *
 * Mirrors PHP's `#[RequestStruct]`.
 */
export function RequestStruct(struct: RequestStructContract) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).requestStruct = struct;
    };
}
