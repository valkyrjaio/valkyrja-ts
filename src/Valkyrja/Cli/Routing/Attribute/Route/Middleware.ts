/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureCliRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { CliMiddlewareReference } from '../RouteAttributeMetadata.ts';

/**
 * Add a middleware to the command(s) declared on a controller method.
 *
 * Mirrors PHP's repeatable `#[Middleware]`. The collector routes the class into
 * whichever middleware buckets it satisfies.
 */
export function Middleware(middleware: CliMiddlewareReference) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureCliRouteMethodMetadata(context.metadata, context.name).middleware.push(middleware);
    };
}
