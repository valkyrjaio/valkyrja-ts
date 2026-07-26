/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Cast } from '../../../Type/Data/Cast.ts';
import type { RequestMethod } from '../../Message/Enum/RequestMethod.ts';
import type { RequestStructContract } from '../../Struct/Request/Contract/RequestStructContract.ts';
import type { ResponseStructContract } from '../../Struct/Response/Contract/ResponseStructContract.ts';
import type { HttpHandlerReference, HttpMiddlewareReference } from './RouteAttributeMetadata.ts';

/**
 * A dynamic-route parameter, folded into the `@DynamicRoute` options because
 * TC39 Stage-3 has no parameter decorators (mirrors PHP's `#[Parameter]`).
 */
export interface ParameterOptions {
    name: string;
    regex: string;
    cast?: Cast | null;
    isOptional?: boolean;
    shouldCapture?: boolean;
    default?: unknown;
}

/**
 * The options accepted by the `@Route` decorator, mirroring the named
 * constructor arguments of PHP's `Valkyrja\Http\Routing\Attribute\Route`.
 */
export interface RouteOptions {
    path: string;
    name: string;
    handler?: HttpHandlerReference;
    requestMethods?: RequestMethod[];
    middleware?: HttpMiddlewareReference[];
    requestStruct?: RequestStructContract;
    responseStruct?: ResponseStructContract;
}

/**
 * The options accepted by the `@DynamicRoute` decorator — a `@Route` plus its
 * folded parameter definitions.
 */
export interface DynamicRouteOptions extends RouteOptions {
    parameters?: ParameterOptions[];
}
