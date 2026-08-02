/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureCliRouteMethodMetadata } from './RouteAttributeMetadata.ts';

import type { OptionParameterOptions } from './RouteOptions.ts';

/**
 * Declare a command option on a controller method.
 *
 * Mirrors PHP's repeatable `#[OptionParameter]`.
 */
export function OptionParameter(options: OptionParameterOptions) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureCliRouteMethodMetadata(context.metadata, context.name).options.push(options);
    };
}
