/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { HttpHandlerReference } from '../RouteAttributeMetadata.ts';

/**
 * Assign the handler for the route(s) declared on a controller method.
 *
 * Mirrors PHP's `#[RouteHandler([HttpRouteProvider::class, 'versionHandler'])]`:
 * the tuple pairs the provider class with the name of its static handler method.
 */
export function RouteHandler(handler: HttpHandlerReference) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).handler = handler;
    };
}
