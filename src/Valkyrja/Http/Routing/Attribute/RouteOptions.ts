/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
export interface RouteOptions<THandler = unknown> {
    path: string;
    name: string;
    /**
     * The handler thunk/method-name pair. See `HttpHandlerReference`: the thunk
     * (Fix 1) sidesteps the decorator-time temporal dead zone, and the generic
     * `THandler` (Fix 2) constrains the method name to a real handler on the
     * referenced class.
     */
    handler?: HttpHandlerReference<THandler>;
    requestMethods?: RequestMethod[];
    middleware?: HttpMiddlewareReference[];
    requestStruct?: RequestStructContract;
    responseStruct?: ResponseStructContract;
    /**
     * Path parameter definitions. A path containing a `{parameter}` placeholder
     * is automatically treated as a dynamic route (mirroring PHP), so parameters
     * may be supplied on a plain `@Route`; `@DynamicRoute` is an explicit alias.
     */
    parameters?: ParameterOptions[];
}

/**
 * The options accepted by the `@DynamicRoute` decorator — identical to
 * `RouteOptions`. Both decorators accept `parameters` and both auto-promote
 * `{parameter}` paths; `@DynamicRoute` merely states the dynamic intent
 * explicitly.
 */
export type DynamicRouteOptions<THandler = unknown> = RouteOptions<THandler>;
