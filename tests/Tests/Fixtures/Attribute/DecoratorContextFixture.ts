/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Build a synthetic Stage-3 method decorator context.
 *
 * The framework's test runner cannot execute real `@`-decorator application,
 * so decorators are exercised by invoking them directly against a fabricated
 * context — the same shape the runtime hands a decorator.
 */
export function methodDecoratorContext(
    name: string,
    metadata: DecoratorMetadataObject = {},
): ClassMethodDecoratorContext {
    return {
        kind: 'method',
        name,
        static: false,
        private: false,
        access: { has: () => true, get: () => undefined },
        addInitializer: () => undefined,
        metadata,
    } as unknown as ClassMethodDecoratorContext;
}

/**
 * Build a synthetic Stage-3 class decorator context.
 */
export function classDecoratorContext(name: string, metadata: DecoratorMetadataObject = {}): ClassDecoratorContext {
    return {
        kind: 'class',
        name,
        addInitializer: () => undefined,
        metadata,
    } as unknown as ClassDecoratorContext;
}

/**
 * Attach a decorator metadata object to a class the way a decorator-lowering
 * loader would (`Class[Symbol.metadata] = metadata`), so the collector can read
 * it back in tests without real decorator application.
 */
export function attachMetadata<T extends new (...args: never[]) => unknown>(
    target: T,
    metadata: DecoratorMetadataObject,
): T {
    const symbolWithMetadata = Symbol as { metadata: symbol | undefined };

    symbolWithMetadata.metadata ??= Symbol.for('Symbol.metadata');

    (target as unknown as Record<symbol, DecoratorMetadataObject>)[symbolWithMetadata.metadata] = metadata;

    return target;
}
