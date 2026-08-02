/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { MessageContract } from '../../Interaction/Message/Contract/MessageContract.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { ProcessExitingMiddlewareContract } from '../../Middleware/Contract/ProcessExitingMiddlewareContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import type { ArgumentParameterOptions, CliRouteOptions, OptionParameterOptions } from './RouteOptions.ts';

/**
 * The signature every CLI command handler must have — the typed closure the
 * dispatcher invokes (mirrors PHP's `OutputContract` handler contract).
 */
export type CliHandler = (container: ContainerContract, route: RouteContract) => OutputContract;

/**
 * The signature every help-text provider must have.
 */
export type CliHelpText = () => MessageContract;

/**
 * The keys of `T` whose value is a valid `CliHandler`.
 *
 * Fix 2 (types) — independent of the thunk below. A bare `string` method name
 * lets a typo or a wrong-signature method compile and only blow up at run time;
 * this mapped type turns both into compile errors. Do not relax it to `string`.
 */
type CliHandlerKeys<T> = { [K in keyof T]: T[K] extends CliHandler ? K : never }[keyof T];

/**
 * The keys of `T` whose value returns a `MessageContract` — the help-text
 * counterpart of `CliHandlerKeys` (Fix 2).
 */
type CliHelpTextKeys<T> = { [K in keyof T]: T[K] extends CliHelpText ? K : never }[keyof T];

/**
 * A command handler reference: a **thunk** returning the provider class that
 * holds the static handler method, paired with the name of that method —
 * mirrors PHP's `[CliRouteProvider::class, 'testCommandHandler']`.
 *
 * Fix 1 (runtime) — the thunk is load-bearing, not decoration. A TC39 Stage-3
 * method decorator runs while the enclosing class binding is still in its
 * temporal dead zone, so naming a class directly (`[CliRouteProvider, 'x']`)
 * dereferences it at class-definition time and throws `ReferenceError: Cannot
 * access 'X' before initialization` whenever the referenced module is still
 * initializing (a circular command ↔ provider import, or a command naming
 * itself — which is exactly why `helpText` had to be dropped before). Building a
 * closure never touches the binding, so the TDZ cannot fire; the collector calls
 * `ref[0]()` later, once every module is initialized. Do not "simplify" this
 * back to a bare class reference — the bare form is an order-dependent footgun
 * and is deliberately not accepted.
 */
export type CliHandlerReference<T> = [() => T, CliHandlerKeys<T> & string];

/**
 * A help-text reference: a thunk returning the class holding a static method
 * that returns the help message — mirrors PHP's `helpText: [self::class,
 * 'help']`, written here as `helpText: [() => TestCommand, 'help']`. The thunk
 * is what makes the self-reference legal (Fix 1).
 */
export type CliHelpTextReference<T> = [() => T, CliHelpTextKeys<T> & string];

/**
 * The loose storage forms of the references above. Only the authoring types are
 * strict; once the metadata is written the concrete class type is no longer
 * needed, so the stored tuple erases it.
 */
export type CliHandlerReferenceMetadata = [() => unknown, string];

export type CliHelpTextReferenceMetadata = [() => unknown, string];

/**
 * A middleware class reference. The buckets it belongs to are resolved
 * structurally by the collector, mirroring PHP's independent `is_a` checks.
 */
export type CliMiddlewareClass = new (
    ...args: unknown[]
) =>
    | RouteMatchedMiddlewareContract
    | RouteDispatchedMiddlewareContract
    | ThrowableCaughtMiddlewareContract
    | ProcessExitingMiddlewareContract;

/**
 * A middleware reference: a **thunk** returning the middleware class.
 *
 * Fix 1 (runtime) — the thunk is load-bearing, for the same reason as
 * `CliHandlerReference`. Naming the class directly dereferences it while the
 * decorator runs, which throws `ReferenceError: Cannot access 'X' before
 * initialization` if that module is still initializing. Building a closure never
 * touches the binding; the collector calls it once every module is ready.
 */
export type CliMiddlewareReference = () => CliMiddlewareClass;

/**
 * The accumulated metadata for a single `@Route` attribute on a command method.
 * Repeatable decorators produce one definition each.
 */
export interface CliRouteDefinition {
    name: string;
    description: string;
    handler: CliHandlerReferenceMetadata | null;
    helpText: CliHelpTextReferenceMetadata | null;
    middleware: CliMiddlewareReference[];
}

/**
 * The accumulated metadata for a single command method: its route definitions
 * plus the modifiers contributed by the other method-level decorators.
 */
export interface CliRouteMethodMetadata {
    routes: CliRouteDefinition[];
    handler: CliHandlerReferenceMetadata | null;
    names: string[];
    middleware: CliMiddlewareReference[];
    arguments: ArgumentParameterOptions[];
    options: OptionParameterOptions[];
}

/**
 * The full attribute metadata attached to a command controller class.
 */
export interface CliRouteAttributeMetadata {
    classNames: string[];
    methods: Map<string, CliRouteMethodMetadata>;
}

/**
 * The property key under which the CLI routing metadata is stored on the
 * standard Stage-3 decorator metadata object.
 */
export const CLI_ROUTE_METADATA_KEY: unique symbol = Symbol('Valkyrja.Cli.Routing.Attribute.Metadata');

/**
 * Ensure `Symbol.metadata` exists so the collector can read decorator metadata
 * off a class in runtimes that predate native support (Node, Vitest).
 */
export function ensureSymbolMetadata(): symbol {
    const symbolWithMetadata = Symbol as { metadata: symbol | undefined };

    symbolWithMetadata.metadata ??= Symbol.for('Symbol.metadata');

    return symbolWithMetadata.metadata;
}

/**
 * Get (creating if absent) the CLI routing metadata container on a decorator
 * metadata object.
 */
export function ensureCliRouteMetadata(metadata: DecoratorMetadataObject): CliRouteAttributeMetadata {
    const store = metadata as Record<symbol, CliRouteAttributeMetadata | undefined>;

    return (store[CLI_ROUTE_METADATA_KEY] ??= {
        classNames: [],
        methods: new Map<string, CliRouteMethodMetadata>(),
    });
}

/**
 * Get (creating if absent) the metadata for a single command method.
 */
export function ensureCliRouteMethodMetadata(
    metadata: DecoratorMetadataObject,
    method: string | symbol,
): CliRouteMethodMetadata {
    const store = ensureCliRouteMetadata(metadata);
    const name = method.toString();

    let entry = store.methods.get(name);

    if (entry === undefined) {
        entry = {
            routes: [],
            handler: null,
            names: [],
            middleware: [],
            arguments: [],
            options: [],
        };

        store.methods.set(name, entry);
    }

    return entry;
}

/**
 * Build a route definition from decorator options.
 */
export function createCliRouteDefinition<THandler, THelpText>(
    options: CliRouteOptions<THandler, THelpText>,
): CliRouteDefinition {
    return {
        name: options.name,
        description: options.description,
        handler: options.handler ?? null,
        helpText: options.helpText ?? null,
        middleware: options.middleware ?? [],
    };
}

/**
 * Read the CLI routing metadata a decorator wrote onto a command class, or
 * `null` when the class carries no routing attributes.
 */
export function readCliRouteMetadata(target: new (...args: unknown[]) => unknown): CliRouteAttributeMetadata | null {
    const metadataSymbol = ensureSymbolMetadata();
    const metadata = (target as unknown as Record<symbol, DecoratorMetadataObject | undefined>)[metadataSymbol];

    if (metadata === undefined) {
        return null;
    }

    const store = metadata as Record<symbol, CliRouteAttributeMetadata | undefined>;

    return store[CLI_ROUTE_METADATA_KEY] ?? null;
}
