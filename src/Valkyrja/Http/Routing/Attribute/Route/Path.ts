/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureHttpRouteMetadata, ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

/**
 * Add a path segment to a route.
 *
 * Mirrors PHP's `#[Path]` (targets a class or a method): a class-level path
 * prefixes every route in the controller, a method-level path is appended to
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
