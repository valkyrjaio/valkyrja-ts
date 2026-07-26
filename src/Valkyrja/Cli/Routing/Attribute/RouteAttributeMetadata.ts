/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteDispatchedMiddlewareContract } from '../../Middleware/Contract/RouteDispatchedMiddlewareContract.ts';
import type { RouteMatchedMiddlewareContract } from '../../Middleware/Contract/RouteMatchedMiddlewareContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';
import type { ProcessExitingMiddlewareContract } from '../../Middleware/Contract/ProcessExitingMiddlewareContract.ts';
import type { ArgumentParameterOptions, CliRouteOptions, OptionParameterOptions } from './RouteOptions.ts';

/**
 * A command handler reference: the provider class holding the static handler
 * method, paired with the method name — mirrors PHP's
 * `[CliRouteProvider::class, 'testCommandHandler']`.
 */
export type CliHandlerReference = [new (...args: unknown[]) => unknown, string];

/**
 * A help-text reference: the class holding a static method that returns the
 * help message — mirrors PHP's `helpText: [self::class, 'help']`.
 */
export type CliHelpTextReference = [new (...args: unknown[]) => unknown, string];

/**
 * A middleware class reference. The buckets it belongs to are resolved
 * structurally by the collector, mirroring PHP's independent `is_a` checks.
 */
export type CliMiddlewareReference = new (
    ...args: unknown[]
) =>
    | RouteMatchedMiddlewareContract
    | RouteDispatchedMiddlewareContract
    | ThrowableCaughtMiddlewareContract
    | ProcessExitingMiddlewareContract;

/**
 * The accumulated metadata for a single `@Route` attribute on a command method.
 * Repeatable decorators produce one definition each.
 */
export interface CliRouteDefinition {
    name: string;
    description: string;
    handler: CliHandlerReference | null;
    helpText: CliHelpTextReference | null;
    middleware: CliMiddlewareReference[];
}

/**
 * The accumulated metadata for a single command method: its route definitions
 * plus the modifiers contributed by the other method-level decorators.
 */
export interface CliRouteMethodMetadata {
    routes: CliRouteDefinition[];
    handler: CliHandlerReference | null;
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
export function createCliRouteDefinition(options: CliRouteOptions): CliRouteDefinition {
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
