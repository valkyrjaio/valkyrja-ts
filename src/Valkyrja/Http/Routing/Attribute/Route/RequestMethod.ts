/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { RequestMethod as RequestMethodEnum } from '../../../Message/Enum/RequestMethod.ts';

/**
 * Add one or more request methods to the route(s) declared on a controller
 * method.
 *
 * Mirrors PHP's `#[RequestMethod]`; the per-verb decorators (`@Get`, `@Post`, …)
 * are thin wrappers around it.
 */
export function RequestMethod(...requestMethods: RequestMethodEnum[]) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).addedRequestMethods.push(...requestMethods);
    };
}
