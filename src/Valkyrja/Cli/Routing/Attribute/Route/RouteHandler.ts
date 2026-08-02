/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureCliRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { CliHandlerReference } from '../RouteAttributeMetadata.ts';

/**
 * Assign the handler for the command(s) declared on a controller method.
 *
 * Mirrors PHP's `#[RouteHandler([CliRouteProvider::class, 'testCommandHandler'])]`,
 * written here as `@RouteHandler([() => CliRouteProvider, 'testCommandHandler'])`.
 *
 * The two pieces of that shape solve two independent problems (see
 * `CliHandlerReference`): the **thunk** keeps the class binding untouched at
 * decoration time so a circular or self-referential import cannot trip the
 * temporal dead zone, and the generic **`THandler`** makes the method name a
 * checked key of that class rather than an arbitrary string.
 */
export function RouteHandler<THandler>(handler: CliHandlerReference<THandler>) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureCliRouteMethodMetadata(context.metadata, context.name).handler = handler;
    };
}
