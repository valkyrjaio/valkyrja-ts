/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureHttpRouteMetadata, ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

/**
 * Add a name segment to a route.
 *
 * Mirrors PHP's `#[Name]` (targets a class or a method): a class-level name
 * prefixes every route in the controller, a method-level name is appended to
 * that method's route names.
 */
export function Name(value: string) {
    return function (_value: unknown, context: ClassDecoratorContext | ClassMethodDecoratorContext): void {
        if (context.kind === 'class') {
            ensureHttpRouteMetadata(context.metadata).classNames.push(value);

            return;
        }

        ensureHttpRouteMethodMetadata(context.metadata, context.name).names.push(value);
    };
}
