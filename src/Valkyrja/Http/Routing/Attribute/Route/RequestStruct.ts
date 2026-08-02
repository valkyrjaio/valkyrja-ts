/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureHttpRouteMethodMetadata } from '../RouteAttributeMetadata.ts';

import type { RequestStructContract } from '../../../Struct/Request/Contract/RequestStructContract.ts';

/**
 * Assign the request struct for the route(s) declared on a controller method.
 *
 * Mirrors PHP's `#[RequestStruct]`.
 */
export function RequestStruct(struct: RequestStructContract) {
    return function (_value: unknown, context: ClassMethodDecoratorContext): void {
        ensureHttpRouteMethodMetadata(context.metadata, context.name).requestStruct = struct;
    };
}
