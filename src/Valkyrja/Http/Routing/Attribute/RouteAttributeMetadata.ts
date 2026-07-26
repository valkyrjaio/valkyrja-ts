/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RequestMethod } from '../../Message/Enum/RequestMethod.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { RequestStructContract } from '../../Struct/Request/Contract/RequestStructContract.ts';
import type { ResponseStructContract } from '../../Struct/Response/Contract/ResponseStructContract.ts';
import type { DynamicRouteOptions, ParameterOptions, RouteOptions } from './RouteOptions.ts';

/**
 * A route handler reference: the provider class holding the static handler
 * method, paired with the method name to invoke — mirrors PHP's
 * `[HttpRouteProvider::class, 'versionHandler']`.
 */
export type HttpHandlerReference = [new (...args: unknown[]) => unknown, string];

/**
 * A middleware class reference. The buckets it belongs to are resolved
 * structurally by the collector (a class may satisfy several middleware
 * contracts at once), mirroring PHP's independent `is_a` checks.
 */
export type HttpMiddlewareReference = new (
    ...args: unknown[]
) =>
    | RouteMatchedMiddlewareContract
    | RouteDispatchedMiddlewareContract
    | ThrowableCaughtMiddlewareContract
    | SendingResponseMiddlewareContract
    | ResponseSentMiddlewareContract;

/**
 * The accumulated metadata for a single `@Route` / `@DynamicRoute` attribute on
 * a controller method. Repeatable decorators produce one definition each.
 */
export interface HttpRouteDefinition {
    path: string;
    name: string;
    dynamic: boolean;
    handler: HttpHandlerReference | null;
    requestMethods: RequestMethod[];
    parameters: ParameterOptions[];
    middleware: HttpMiddlewareReference[];
    requestStruct: RequestStructContract | null;
    responseStruct: ResponseStructContract | null;
}

/**
 * The accumulated metadata for a single controller method: its route
 * definitions plus the modifiers contributed by the other method-level
 * decorators (`@RouteHandler`, request-method decorators, `@Middleware`,
 * `@Name`, `@Path`, `@RequestStruct`, `@ResponseStruct`).
 */
export interface HttpRouteMethodMetadata {
    routes: HttpRouteDefinition[];
    handler: HttpHandlerReference | null;
    addedRequestMethods: RequestMethod[];
    middleware: HttpMiddlewareReference[];
    paths: string[];
    names: string[];
    requestStruct: RequestStructContract | null;
    responseStruct: ResponseStructContract | null;
}

/**
 * The full attribute metadata attached to a controller class: the class-level
 * `@Path` / `@Name` prefixes plus every decorated method's metadata.
 */
export interface HttpRouteAttributeMetadata {
    classPaths: string[];
    classNames: string[];
    methods: Map<string, HttpRouteMethodMetadata>;
}

/**
 * The property key under which the routing metadata is stored on the standard
 * Stage-3 decorator metadata object (`context.metadata`, later exposed as
 * `Controller[Symbol.metadata]`).
 */
export const HTTP_ROUTE_METADATA_KEY: unique symbol = Symbol('Valkyrja.Http.Routing.Attribute.Metadata');

/**
 * Ensure `Symbol.metadata` exists so the collector can read decorator metadata
 * off a class in runtimes that predate native support (Node, Vitest). Loaders
 * that lower decorators (tsx/esbuild) assign `context.metadata` to this same
 * well-known symbol.
 */
export function ensureSymbolMetadata(): symbol {
    const symbolWithMetadata = Symbol as { metadata: symbol | undefined };

    symbolWithMetadata.metadata ??= Symbol.for('Symbol.metadata');

    return symbolWithMetadata.metadata;
}

/**
 * Get (creating if absent) the routing metadata container on a decorator
 * metadata object.
 */
export function ensureHttpRouteMetadata(metadata: DecoratorMetadataObject): HttpRouteAttributeMetadata {
    const store = metadata as Record<symbol, HttpRouteAttributeMetadata | undefined>;

    return (store[HTTP_ROUTE_METADATA_KEY] ??= {
        classPaths: [],
        classNames: [],
        methods: new Map<string, HttpRouteMethodMetadata>(),
    });
}

/**
 * Get (creating if absent) the metadata for a single controller method.
 */
export function ensureHttpRouteMethodMetadata(
    metadata: DecoratorMetadataObject,
    method: string | symbol,
): HttpRouteMethodMetadata {
    const store = ensureHttpRouteMetadata(metadata);
    const name = method.toString();

    let entry = store.methods.get(name);

    if (entry === undefined) {
        entry = {
            routes: [],
            handler: null,
            addedRequestMethods: [],
            middleware: [],
            paths: [],
            names: [],
            requestStruct: null,
            responseStruct: null,
        };

        store.methods.set(name, entry);
    }

    return entry;
}

/**
 * Build a route definition from decorator options, applying the same defaults
 * as the imperative `Route` / `DynamicRoute` data classes.
 */
export function createHttpRouteDefinition(
    options: RouteOptions | DynamicRouteOptions,
    dynamic: boolean,
): HttpRouteDefinition {
    return {
        path: options.path,
        name: options.name,
        dynamic,
        handler: options.handler ?? null,
        requestMethods: options.requestMethods ?? [],
        parameters: (options as DynamicRouteOptions).parameters ?? [],
        middleware: options.middleware ?? [],
        requestStruct: options.requestStruct ?? null,
        responseStruct: options.responseStruct ?? null,
    };
}

/**
 * Read the routing metadata a decorator wrote onto a controller class, or
 * `null` when the class carries no routing attributes.
 */
export function readHttpRouteMetadata(target: new (...args: unknown[]) => unknown): HttpRouteAttributeMetadata | null {
    const metadataSymbol = ensureSymbolMetadata();
    const metadata = (target as unknown as Record<symbol, DecoratorMetadataObject | undefined>)[metadataSymbol];

    if (metadata === undefined) {
        return null;
    }

    const store = metadata as Record<symbol, HttpRouteAttributeMetadata | undefined>;

    return store[HTTP_ROUTE_METADATA_KEY] ?? null;
}
