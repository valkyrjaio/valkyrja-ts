/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { ResponseStructContract } from '../../../Struct/Response/Contract/ResponseStructContract.ts';

/**
 * Assign the response struct for the route(s) declared on a controller method.
 *
 * Mirrors PHP's `#[ResponseStruct]`.
 */
export function ResponseStruct(struct: ResponseStructContract) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).responseStruct = struct;
    };
}
