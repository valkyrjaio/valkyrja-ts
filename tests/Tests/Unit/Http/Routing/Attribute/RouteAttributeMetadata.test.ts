/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import {
    createHttpRouteDefinition,
    ensureHttpRouteMetadata,
    ensureHttpRouteMethodMetadata,
    ensureSymbolMetadata,
    readHttpRouteMetadata,
} from '../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { attachMetadata } from '../../../../Fixtures/Http/Routing/Attribute/DecoratorContextFixture.ts';

describe('RouteAttributeMetadata', () => {
    describe('ensureSymbolMetadata', () => {
        it('returns a stable Symbol.metadata across calls', () => {
            expect(ensureSymbolMetadata()).toBe(ensureSymbolMetadata());
        });
    });

    describe('ensureHttpRouteMetadata', () => {
        it('creates the store once and reuses it', () => {
            const metadata = {} as DecoratorMetadataObject;

            const first = ensureHttpRouteMetadata(metadata);
            first.classNames.push('admin');

            expect(ensureHttpRouteMetadata(metadata)).toBe(first);
            expect(ensureHttpRouteMetadata(metadata).classNames).toStrictEqual(['admin']);
        });
    });

    describe('ensureHttpRouteMethodMetadata', () => {
        it('creates a method entry once and reuses it', () => {
            const metadata = {} as DecoratorMetadataObject;

            const first = ensureHttpRouteMethodMetadata(metadata, 'version');

            expect(ensureHttpRouteMethodMetadata(metadata, 'version')).toBe(first);
        });

        it('keys entries by the stringified method name', () => {
            const metadata = {} as DecoratorMetadataObject;
            const symbol = Symbol('handle');

            ensureHttpRouteMethodMetadata(metadata, symbol).names.push('symbolic');

            expect(ensureHttpRouteMetadata(metadata).methods.get(symbol.toString())?.names).toStrictEqual(['symbolic']);
        });
    });

    describe('createHttpRouteDefinition', () => {
        it('applies defaults for a static route', () => {
            expect(createHttpRouteDefinition({ path: '/', name: 'welcome' }, false)).toStrictEqual({
                path: '/',
                name: 'welcome',
                dynamic: false,
                handler: null,
                requestMethods: [],
                parameters: [],
                middleware: [],
                requestStruct: null,
                responseStruct: null,
            });
        });

        it('carries dynamic parameters and provided options', () => {
            const definition = createHttpRouteDefinition(
                {
                    path: '/{value}',
                    name: 'dynamicValue',
                    requestMethods: [RequestMethod.GET],
                    parameters: [{ name: 'value', regex: '[a-z]+' }],
                },
                true,
            );

            expect(definition.dynamic).toBe(true);
            expect(definition.parameters).toStrictEqual([{ name: 'value', regex: '[a-z]+' }]);
            expect(definition.requestMethods).toStrictEqual([RequestMethod.GET]);
        });
    });

    describe('readHttpRouteMetadata', () => {
        it('returns null when the class has no decorator metadata', () => {
            class Bare {}

            expect(readHttpRouteMetadata(Bare)).toBeNull();
        });

        it('returns null when the metadata carries no routing store', () => {
            class Empty {}
            attachMetadata(Empty, {});

            expect(readHttpRouteMetadata(Empty)).toBeNull();
        });

        it('returns the routing store attached to the class', () => {
            const metadata = {} as DecoratorMetadataObject;
            ensureHttpRouteMethodMetadata(metadata, 'version').routes.push(
                createHttpRouteDefinition({ path: '/version', name: 'version' }, false),
            );

            class Controller {}
            attachMetadata(Controller, metadata);

            expect(readHttpRouteMetadata(Controller)?.methods.get('version')?.routes[0]?.name).toBe('version');
        });
    });
});
