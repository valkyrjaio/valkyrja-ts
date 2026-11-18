/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import {
    createGrpcRouteDefinition,
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

    it('applies defaults when building a route definition', () => {
        expect(createGrpcRouteDefinition({ name: 'Ping' })).toStrictEqual({
            name: 'Ping',
            handler: null,
            requestType: null,
            responseType: null,
            clientStreaming: false,
            serverStreaming: false,
            routeMatchedMiddleware: [],
            routeDispatchedMiddleware: [],
            throwableCaughtMiddleware: [],
            sendingResponseMiddleware: [],
            responseSentMiddleware: [],
        });
    });

    it('keeps every explicit option when building a route definition', () => {
        const handler: [() => unknown, string] = [() => undefined, 'ping'];
        // Each stage gets its own class, so an argument wired to the wrong stage fails rather
        // than passing on a value its sibling also holds.
        const matched = [() => class Matched {}] as never;
        const dispatched = [() => class Dispatched {}] as never;
        const caught = [() => class Caught {}] as never;
        const sending = [() => class Sending {}] as never;
        const sent = [() => class Sent {}] as never;

        expect(
            createGrpcRouteDefinition({
                name: 'Echo',
                handler: handler as never,
                requestType: 'EchoRequest' as never,
                responseType: 'EchoResponse' as never,
                clientStreaming: true,
                serverStreaming: false,
                routeMatchedMiddleware: matched,
                routeDispatchedMiddleware: dispatched,
                throwableCaughtMiddleware: caught,
                sendingResponseMiddleware: sending,
                responseSentMiddleware: sent,
            }),
        ).toStrictEqual({
            name: 'Echo',
            handler,
            requestType: 'EchoRequest',
            responseType: 'EchoResponse',
            clientStreaming: true,
            serverStreaming: false,
            routeMatchedMiddleware: matched,
            routeDispatchedMiddleware: dispatched,
            throwableCaughtMiddleware: caught,
            sendingResponseMiddleware: sending,
            responseSentMiddleware: sent,
        });
    });

    it('keeps the streaming flags apart', () => {
        // The pair above sets clientStreaming alone, so this one sets serverStreaming alone.
        // Neither position is pinned by a fixture that gives both flags one value.
        expect(createGrpcRouteDefinition({ name: 'Fanout', serverStreaming: true })).toMatchObject({
            clientStreaming: false,
            serverStreaming: true,
        });
    });

    it('reads back the routing store attached to a class', () => {
        const metadata = {} as DecoratorMetadataObject;
        ensureGrpcMethodMetadata(metadata, 'ping').routes.push(createGrpcRouteDefinition({ name: 'Ping' }));

        class Controller {}
        attachMetadata(Controller, metadata);

        expect(readGrpcRouteMetadata(Controller)?.methods.get('ping')?.routes[0]?.name).toBe('Ping');
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
