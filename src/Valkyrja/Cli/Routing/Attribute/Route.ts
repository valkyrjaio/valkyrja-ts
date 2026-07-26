/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
export function Route(options: CliRouteOptions) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureCliRouteMethodMetadata(context.metadata, context.name).routes.push(createCliRouteDefinition(options));
    };
}
