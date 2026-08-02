/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureCliRouteMethodMetadata } from './RouteAttributeMetadata.ts';

import type { ArgumentParameterOptions } from './RouteOptions.ts';

/**
 * Declare a command argument on a controller method.
 *
 * Mirrors PHP's repeatable `#[ArgumentParameter]`.
 */
export function ArgumentParameter(options: ArgumentParameterOptions) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureCliRouteMethodMetadata(context.metadata, context.name).arguments.push(options);
    };
}
