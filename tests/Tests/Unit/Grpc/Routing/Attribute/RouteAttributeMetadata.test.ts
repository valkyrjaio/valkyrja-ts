/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import {
    createGrpcMethodDefinition,
    ensureGrpcMethodMetadata,
    ensureGrpcRouteMetadata,
    ensureSymbolMetadata,
    readGrpcRouteMetadata,
} from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/RouteAttributeMetadata.ts';
import { attachMetadata } from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Grpc RouteAttributeMetadata', () => {
    it('returns a stable Symbol.metadata across calls', () => {
        expect(ensureSymbolMetadata()).toBe(ensureSymbolMetadata());
    });

    it('creates the store once and reuses it', () => {
        const metadata = {} as DecoratorMetadataObject;
        const first = ensureGrpcRouteMetadata(metadata);
        first.services.push('pkg.Ping');

        expect(ensureGrpcRouteMetadata(metadata)).toBe(first);
        expect(ensureGrpcRouteMetadata(metadata).services).toStrictEqual(['pkg.Ping']);
    });

    it('creates a method entry once and keys it by the stringified method name', () => {
        const metadata = {} as DecoratorMetadataObject;
        const symbol = Symbol('ping');

        const first = ensureGrpcMethodMetadata(metadata, symbol);

        expect(ensureGrpcMethodMetadata(metadata, symbol)).toBe(first);
        expect(ensureGrpcRouteMetadata(metadata).methods.get(symbol.toString())).toBe(first);
    });

    it('applies defaults when building a method definition', () => {
        expect(createGrpcMethodDefinition({ name: 'Ping' })).toStrictEqual({
            name: 'Ping',
            clientStreaming: false,
            serverStreaming: false,
            handler: null,
            middleware: [],
        });
    });

    it('keeps every explicit option when building a method definition', () => {
        const handler: [() => unknown, string] = [() => undefined, 'ping'];
        const middleware = [() => class {}] as never;

        expect(
            createGrpcMethodDefinition({
                name: 'Echo',
                clientStreaming: true,
                serverStreaming: true,
                handler: handler as never,
                middleware,
            }),
        ).toStrictEqual({
            name: 'Echo',
            clientStreaming: true,
            serverStreaming: true,
            handler,
            middleware,
        });
    });

    it('reads back the routing store attached to a class', () => {
        const metadata = {} as DecoratorMetadataObject;
        ensureGrpcMethodMetadata(metadata, 'ping').methods.push(createGrpcMethodDefinition({ name: 'Ping' }));

        class Controller {}
        attachMetadata(Controller, metadata);

        expect(readGrpcRouteMetadata(Controller)?.methods.get('ping')?.methods[0]?.name).toBe('Ping');
    });

    it('returns null when the class has no decorator metadata', () => {
        class Bare {}

        expect(readGrpcRouteMetadata(Bare)).toBeNull();
    });

    it('returns null when the metadata carries no routing store', () => {
        class Empty {}
        attachMetadata(Empty, {});

        expect(readGrpcRouteMetadata(Empty)).toBeNull();
    });
});
