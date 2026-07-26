/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureCliRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { CliHandlerReference } from '../RouteAttributeMetadata.ts';

/**
 * Assign the handler for the command(s) declared on a controller method.
 *
 * Mirrors PHP's `#[RouteHandler([CliRouteProvider::class, 'testCommandHandler'])]`.
 */
export function RouteHandler(handler: CliHandlerReference) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureCliRouteMethodMetadata(context.metadata, context.name).handler = handler;
    };
}
