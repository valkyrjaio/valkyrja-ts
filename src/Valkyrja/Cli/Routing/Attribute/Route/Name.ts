/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureCliRouteMetadata, ensureCliRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

/**
 * Add a name segment to a command.
 *
 * Mirrors PHP's `#[Name]` (targets a class or a method): a class-level name
 * prefixes every command in the controller, a method-level name is appended to
 * that method's command names.
 */
export function Name(value: string) {
    return function (_value: unknown, context: ClassDecoratorContext | ClassMethodDecoratorContext): void {
        if (context.kind === 'class') {
            ensureCliRouteMetadata(context.metadata).classNames.push(value);

            return;
        }

        ensureCliRouteMethodMetadata(context.metadata, context.name).names.push(value);
    };
}
