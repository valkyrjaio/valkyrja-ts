/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
