/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { createCliRouteDefinition, ensureCliRouteMethodMetadata } from './RouteAttributeMetadata.ts';

import type { CliRouteOptions } from './RouteOptions.ts';

/**
 * Declare a CLI command on a controller method.
 *
 * Mirrors PHP's repeatable `#[Route]`: stack it to declare several commands for
 * one method. Sindri reads it statically to build the command cache; in debug
 * mode the runtime `AttributeRouteCollector` reads it from the class metadata.
 */
export function Route<THandler = unknown, THelpText = unknown>(options: CliRouteOptions<THandler, THelpText>) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureCliRouteMethodMetadata(context.metadata, context.name).routes.push(createCliRouteDefinition(options));
    };
}
