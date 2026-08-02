/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { RequestMethod as RequestMethodEnum } from '../../../Message/Enum/RequestMethod.ts';

/**
 * Add one or more request methods to the route(s) declared on a controller
 * method.
 *
 * Mirrors PHP's `#[RequestMethod]`; the per-verb decorators (`@Get`, `@Post`, …)
 * are thin wrappers around it.
 */
export function RequestMethod(...requestMethods: RequestMethodEnum[]) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).addedRequestMethods.push(...requestMethods);
    };
}
