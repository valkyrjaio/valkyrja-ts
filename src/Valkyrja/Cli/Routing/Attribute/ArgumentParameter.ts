/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
