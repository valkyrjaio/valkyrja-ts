/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureHttpRouteMetadata, ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

/**
 * Add a path segment to a route.
 *
 * Mirrors PHP's `#[Path]` (targets a class or a method): a class-level path
 * prefixes every route in the controller, a method-level path is prepended to
 * that method's route paths.
 */
export function Path(value: string) {
    return function (_value: unknown, context: ClassDecoratorContext | ClassMethodDecoratorContext): void {
        if (context.kind === 'class') {
            ensureHttpRouteMetadata(context.metadata).classPaths.push(value);

            return;
        }

        ensureHttpRouteMethodMetadata(context.metadata, context.name).paths.push(value);
    };
}
