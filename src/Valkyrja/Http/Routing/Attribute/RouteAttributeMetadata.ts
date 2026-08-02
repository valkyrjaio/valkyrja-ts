/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { RequestMethod } from '../../Message/Enum/RequestMethod.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { RequestStructContract } from '../../Struct/Request/Contract/RequestStructContract.ts';
import type { ResponseStructContract } from '../../Struct/Response/Contract/ResponseStructContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { ParameterOptions, RouteOptions } from './RouteOptions.ts';

/**
 * The signature every HTTP route handler must have — the typed closure the
 * dispatcher invokes (mirrors PHP's `ResponseContract` handler contract).
 */
export type HttpHandler = (container: ContainerContract, route: RouteContract) => ResponseContract;

/**
 * The keys of `T` whose value is a valid `HttpHandler`.
 *
 * Fix 2 (types) — independent of the thunk below. Without this mapped type the
 * method name is a bare `string`, so a typo or a method with the wrong signature
 * compiles fine and only fails at run time. Constraining the tuple's second
 * element to `HttpHandlerKeys<T>` makes both a compile error. Do not relax it
 * back to `string`.
 */
type HttpHandlerKeys<T> = { [K in keyof T]: T[K] extends HttpHandler ? K : never }[keyof T];

/**
 * A route handler reference: a **thunk** returning the provider class that holds
 * the static handler method, paired with the name of that method — mirrors PHP's
 * `[HttpRouteProvider::class, 'versionHandler']`.
 *
 * Fix 1 (runtime) — the thunk is load-bearing, not decoration. A TC39 Stage-3
 * method decorator runs while the enclosing class binding is still in its
 * temporal dead zone, so naming a class directly (`[HttpRouteProvider, 'x']`)
 * dereferences it at class-definition time and throws `ReferenceError: Cannot
 * access 'X' before initialization` whenever the referenced module is still
 * initializing (a circular controller ↔ provider import, or a class naming
 * itself). Building a closure never touches the binding, so the TDZ cannot fire;
 * the collector calls `ref[0]()` later, once every module is initialized. Do not
 * "simplify" this back to a bare class reference — the bare form is an
 * order-dependent footgun and is deliberately not accepted.
 */
export type HttpHandlerReference<T> = [() => T, HttpHandlerKeys<T> & string];

/**
 * The loose storage form of a handler reference. Only the authoring type above
 * is strict; once the metadata is written the concrete provider type is no
 * longer needed, so the stored tuple erases it.
 */
export type HttpHandlerReferenceMetadata = [() => unknown, string];

/**
 * A middleware class reference. The buckets it belongs to are resolved
 * structurally by the collector (a class may satisfy several middleware
 * contracts at once), mirroring PHP's independent `is_a` checks.
 */
export type HttpMiddlewareClass = new (
    ...args: unknown[]
) =>
    | RouteMatchedMiddlewareContract
    | RouteDispatchedMiddlewareContract
    | ThrowableCaughtMiddlewareContract
    | SendingResponseMiddlewareContract
    | ResponseSentMiddlewareContract;

/**
 * A middleware reference: a **thunk** returning the middleware class.
 *
 * Fix 1 (runtime) — the thunk is load-bearing, for the same reason as
 * `HttpHandlerReference`. Naming the class directly dereferences it while the
 * decorator runs, which throws `ReferenceError: Cannot access 'X' before
 * initialization` if that module is still initializing. Building a closure never
 * touches the binding; the collector calls it once every module is ready.
 */
export type HttpMiddlewareReference = () => HttpMiddlewareClass;

/**
 * The accumulated metadata for a single `@Route` / `@DynamicRoute` attribute on
 * a controller method. Repeatable decorators produce one definition each.
 */
export interface HttpRouteDefinition {
    path: string;
    name: string;
    dynamic: boolean;
    handler: HttpHandlerReferenceMetadata | null;
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
    handler: HttpHandlerReferenceMetadata | null;
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
export function createHttpRouteDefinition<THandler>(
    options: RouteOptions<THandler>,
    dynamic: boolean,
): HttpRouteDefinition {
    return {
        path: options.path,
        name: options.name,
        // A `{parameter}` placeholder auto-promotes the route to dynamic, mirroring PHP.
        dynamic: dynamic || options.path.includes('{'),
        handler: options.handler ?? null,
        requestMethods: options.requestMethods ?? [],
        parameters: options.parameters ?? [],
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
