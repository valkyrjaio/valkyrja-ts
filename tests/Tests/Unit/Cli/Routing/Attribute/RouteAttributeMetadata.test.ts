/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import {
    createCliRouteDefinition,
    ensureCliRouteMetadata,
    ensureCliRouteMethodMetadata,
    ensureSymbolMetadata,
    readCliRouteMetadata,
} from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import { attachMetadata } from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Cli RouteAttributeMetadata', () => {
    it('returns a stable Symbol.metadata across calls', () => {
        expect(ensureSymbolMetadata()).toBe(ensureSymbolMetadata());
    });

    it('creates the store once and reuses it', () => {
        const metadata = {} as DecoratorMetadataObject;
        const first = ensureCliRouteMetadata(metadata);
        first.classNames.push('app');

        expect(ensureCliRouteMetadata(metadata)).toBe(first);
        expect(ensureCliRouteMetadata(metadata).classNames).toStrictEqual(['app']);
    });

    it('creates a method entry once and keys it by the stringified method name', () => {
        const metadata = {} as DecoratorMetadataObject;
        const symbol = Symbol('run');

        const first = ensureCliRouteMethodMetadata(metadata, symbol);

        expect(ensureCliRouteMethodMetadata(metadata, symbol)).toBe(first);
        expect(ensureCliRouteMetadata(metadata).methods.get(symbol.toString())).toBe(first);
    });

    it('applies defaults when building a route definition', () => {
        expect(createCliRouteDefinition({ name: 'test', description: 'Test command' })).toStrictEqual({
            name: 'test',
            description: 'Test command',
            handler: null,
            helpText: null,
            middleware: [],
        });
    });

    it('reads back the routing store attached to a class', () => {
        const metadata = {} as DecoratorMetadataObject;
        ensureCliRouteMethodMetadata(metadata, 'run').routes.push(
            createCliRouteDefinition({ name: 'test', description: 'Test command' }),
        );

        class Command {}
        attachMetadata(Command, metadata);

        expect(readCliRouteMetadata(Command)?.methods.get('run')?.routes[0]?.name).toBe('test');
    });

    it('returns null when the class has no decorator metadata', () => {
        class Bare {}

        expect(readCliRouteMetadata(Bare)).toBeNull();
    });

    it('returns null when the metadata carries no routing store', () => {
        class Empty {}
        attachMetadata(Empty, {});

        expect(readCliRouteMetadata(Empty)).toBeNull();
    });
});
