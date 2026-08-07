/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Middleware/Contract/ResponseSentMiddlewareContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { SendingResponseMiddlewareContract } from '../../Middleware/Contract/SendingResponseMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { GrpcMethodOptions } from './RouteOptions.ts';

/**
 * The signature every gRPC handler must have. The pipeline is asynchronous, so a handler returns a
 * promise.
 */
export type GrpcHandler = (container: ContainerContract, route: RouteContract) => Promise<ServiceResponseContract>;

/**
 * The keys of `T` whose value is a valid `GrpcHandler`.
 *
 * A bare `string` method name lets a typo, or a method with the wrong signature, compile. The error
 * then appears at run time. This mapped type makes both a compile error. Do not relax it to
 * `string`.
 */
type GrpcHandlerKeys<T> = { [K in keyof T]: T[K] extends GrpcHandler ? K : never }[keyof T];

/**
 * A handler reference: a **thunk** that returns the class which holds the static handler method,
 * with the name of that method.
 *
 * Warning: the thunk is load-bearing. A TC39 Stage-3 method decorator runs while the enclosing class
 * binding is still in its temporal dead zone. A direct class reference therefore dereferences the
 * binding at class-definition time, and it throws `ReferenceError: Cannot access 'X' before
 * initialization` when the referenced module is still initializing. A closure never reads the
 * binding, so the temporal dead zone cannot fire. The collector calls `ref[0]()` later, after every
 * module initializes. Do not replace the thunk with a bare class reference.
 */
export type GrpcHandlerReference<T> = [() => T, GrpcHandlerKeys<T> & string];

/**
 * The loose storage form of the reference above. Only the authoring type is strict. The stored tuple
 * erases the concrete class type, because the metadata no longer needs it.
 */
export type GrpcHandlerReferenceMetadata = [() => unknown, string];

/**
 * A middleware class reference. The collector resolves the stages the class serves structurally.
 */
export type GrpcMiddlewareClass = new (
    ...args: unknown[]
) =>
    | RouteMatchedMiddlewareContract
    | RouteDispatchedMiddlewareContract
    | ThrowableCaughtMiddlewareContract
    | SendingResponseMiddlewareContract
    | ResponseSentMiddlewareContract;

/**
 * A middleware reference: a **thunk** that returns the middleware class. The thunk is load-bearing
 * for the same reason as `GrpcHandlerReference`.
 */
export type GrpcMiddlewareReference = () => GrpcMiddlewareClass;

export interface GrpcMethodDefinition {
    name: string;
    clientStreaming: boolean;
    serverStreaming: boolean;
    handler: GrpcHandlerReferenceMetadata | null;
    middleware: GrpcMiddlewareReference[];
}

export interface GrpcMethodMetadata {
    methods: GrpcMethodDefinition[];
    middleware: GrpcMiddlewareReference[];
}

export interface GrpcRouteAttributeMetadata {
    services: string[];
    methods: Map<string, GrpcMethodMetadata>;
}

/** The property key under which the gRPC routing metadata is stored on the decorator metadata. */
export const GRPC_ROUTE_METADATA_KEY: unique symbol = Symbol('Valkyrja.Grpc.Routing.Attribute.Metadata');

/**
 * Make sure `Symbol.metadata` exists, so the collector can read decorator metadata off a class in a
 * runtime that predates native support.
 */
export function ensureSymbolMetadata(): symbol {
    const symbolWithMetadata = Symbol as { metadata: symbol | undefined };

    symbolWithMetadata.metadata ??= Symbol.for('Symbol.metadata');

    return symbolWithMetadata.metadata;
}

/** Get the gRPC routing metadata container on a decorator metadata object, and create it if absent. */
export function ensureGrpcRouteMetadata(metadata: DecoratorMetadataObject): GrpcRouteAttributeMetadata {
    const store = metadata as Record<symbol, GrpcRouteAttributeMetadata | undefined>;

    return (store[GRPC_ROUTE_METADATA_KEY] ??= {
        services: [],
        methods: new Map<string, GrpcMethodMetadata>(),
    });
}

/** Get the metadata for a single controller method, and create it if absent. */
export function ensureGrpcMethodMetadata(
    metadata: DecoratorMetadataObject,
    method: string | symbol,
): GrpcMethodMetadata {
    const store = ensureGrpcRouteMetadata(metadata);
    const name = method.toString();

    let entry = store.methods.get(name);

    if (entry === undefined) {
        entry = { methods: [], middleware: [] };

        store.methods.set(name, entry);
    }

    return entry;
}

/** Build a method definition from decorator options. */
export function createGrpcMethodDefinition<THandler>(options: GrpcMethodOptions<THandler>): GrpcMethodDefinition {
    return {
        name: options.name,
        clientStreaming: options.clientStreaming ?? false,
        serverStreaming: options.serverStreaming ?? false,
        handler: options.handler ?? null,
        middleware: options.middleware ?? [],
    };
}

/**
 * Read the gRPC routing metadata a decorator wrote onto a controller class. Returns null when the
 * class carries no routing attributes.
 */
export function readGrpcRouteMetadata(target: new (...args: unknown[]) => unknown): GrpcRouteAttributeMetadata | null {
    const metadataSymbol = ensureSymbolMetadata();
    const metadata = (target as unknown as Record<symbol, DecoratorMetadataObject | undefined>)[metadataSymbol];

    if (metadata === undefined) {
        return null;
    }

    const store = metadata as Record<symbol, GrpcRouteAttributeMetadata | undefined>;

    return store[GRPC_ROUTE_METADATA_KEY] ?? null;
}
