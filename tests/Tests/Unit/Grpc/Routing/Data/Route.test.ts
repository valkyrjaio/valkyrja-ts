/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { StatusCode } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { Route } from '../../../../../../src/Valkyrja/Grpc/Routing/Data/Route.ts';
import { GrpcRoutingInvalidMethodException } from '../../../../../../src/Valkyrja/Grpc/Routing/Throwable/Exception/GrpcRoutingInvalidMethodException.ts';
import { RespondingRouteDispatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingRouteDispatchedMiddlewareFixture.ts';
import { RespondingSendingResponseMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingSendingResponseMiddlewareFixture.ts';
import { RespondingThrowableCaughtMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RespondingThrowableCaughtMiddlewareFixture.ts';
import { RecordingResponseSentMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/RecordingResponseSentMiddlewareFixture.ts';
import { ShortCircuitRouteMatchedMiddlewareFixture } from '../../../../Fixtures/Grpc/Middleware/ShortCircuitRouteMatchedMiddlewareFixture.ts';
import { RouteFixture } from '../../../../Fixtures/Grpc/Routing/RouteFixture.ts';

class RequestMessageFixture {}
class ResponseMessageFixture {}

describe('Route', () => {
    it('derives the service and method name from the fully-qualified method', () => {
        const route = RouteFixture.make('/pkg.sub.Service/DoThing');

        expect(route.getMethod()).toBe('/pkg.sub.Service/DoThing');
        expect(route.getService()).toBe('pkg.sub.Service');
        expect(route.getMethodName()).toBe('DoThing');
    });

    it.each([['pkg.Service/Method'], ['/pkg.Service'], ['//'], ['']])('rejects the malformed method %j', (method) => {
        expect(() => RouteFixture.make(method)).toThrow(GrpcRoutingInvalidMethodException);
    });

    it('rejects a method with no name after the final slash', () => {
        expect(() => RouteFixture.make('/pkg.Service/')).toThrow(GrpcRoutingInvalidMethodException);
    });

    it('accepts an explicit service and method name', () => {
        const route = new Route('/pkg.Service/Method', RouteFixture.okHandler(), 'other.Service', 'Other');

        expect(route.getService()).toBe('other.Service');
        expect(route.getMethodName()).toBe('Other');
    });

    it('defaults its optional fields', () => {
        const route = RouteFixture.make();

        expect(route.getRequestType()).toBeNull();
        expect(route.getResponseType()).toBeNull();
        expect(route.isClientStreaming()).toBe(false);
        expect(route.isServerStreaming()).toBe(false);
        expect(route.getRouteMatchedMiddleware()).toEqual([]);
        expect(route.getRouteDispatchedMiddleware()).toEqual([]);
        expect(route.getThrowableCaughtMiddleware()).toEqual([]);
        expect(route.getSendingResponseMiddleware()).toEqual([]);
        expect(route.getResponseSentMiddleware()).toEqual([]);
    });

    it('carries its handler', async () => {
        const route = RouteFixture.make('/pkg.Service/Method', RouteFixture.okHandler('payload'));
        const response = await route.getHandler()(new Container(), route);

        expect(response.getStatus().getCode()).toBe(StatusCode.OK);
        expect([...response.getMessages()]).toEqual(['payload']);
    });

    it('copies with a new handler', async () => {
        const route = RouteFixture.make();
        const copy = route.withHandler(RouteFixture.okHandler('other'));
        const response = await copy.getHandler()(new Container(), copy);

        expect([...response.getMessages()]).toEqual(['other']);
        expect(copy).not.toBe(route);
    });

    it('copies with the message types', () => {
        const route = RouteFixture.make();

        expect(route.withRequestType(RequestMessageFixture).getRequestType()).toBe(RequestMessageFixture);
        expect(route.withResponseType(ResponseMessageFixture).getResponseType()).toBe(ResponseMessageFixture);
        expect(route.withRequestType(RequestMessageFixture).withRequestType(null).getRequestType()).toBeNull();
        expect(route.withResponseType(ResponseMessageFixture).withResponseType(null).getResponseType()).toBeNull();
        expect(route.getRequestType()).toBeNull();
    });

    it('copies with the streaming flags', () => {
        const route = RouteFixture.make();

        expect(route.withClientStreaming(true).isClientStreaming()).toBe(true);
        expect(route.withServerStreaming(true).isServerStreaming()).toBe(true);
        expect(route.withClientStreaming(true).withServerStreaming(true).isServerStreaming()).toBe(true);
        expect(route.isClientStreaming()).toBe(false);
        expect(route.isServerStreaming()).toBe(false);
    });

    // The five stage triples are identical in shape, so they share one table of accessors rather
    // than five near-identical blocks. Each entry closes over its own fixture, which keeps every
    // call site typed against the stage's real middleware contract.
    describe.each([
        {
            stage: 'RouteMatched',
            fixture: ShortCircuitRouteMatchedMiddlewareFixture,
            get: (route: Route): unknown[] => route.getRouteMatchedMiddleware(),
            set: (route: Route): Route => route.withRouteMatchedMiddleware(ShortCircuitRouteMatchedMiddlewareFixture),
            add: (route: Route): Route =>
                route.withAddedRouteMatchedMiddleware(ShortCircuitRouteMatchedMiddlewareFixture),
        },
        {
            stage: 'RouteDispatched',
            fixture: RespondingRouteDispatchedMiddlewareFixture,
            get: (route: Route): unknown[] => route.getRouteDispatchedMiddleware(),
            set: (route: Route): Route =>
                route.withRouteDispatchedMiddleware(RespondingRouteDispatchedMiddlewareFixture),
            add: (route: Route): Route =>
                route.withAddedRouteDispatchedMiddleware(RespondingRouteDispatchedMiddlewareFixture),
        },
        {
            stage: 'ThrowableCaught',
            fixture: RespondingThrowableCaughtMiddlewareFixture,
            get: (route: Route): unknown[] => route.getThrowableCaughtMiddleware(),
            set: (route: Route): Route =>
                route.withThrowableCaughtMiddleware(RespondingThrowableCaughtMiddlewareFixture),
            add: (route: Route): Route =>
                route.withAddedThrowableCaughtMiddleware(RespondingThrowableCaughtMiddlewareFixture),
        },
        {
            stage: 'SendingResponse',
            fixture: RespondingSendingResponseMiddlewareFixture,
            get: (route: Route): unknown[] => route.getSendingResponseMiddleware(),
            set: (route: Route): Route =>
                route.withSendingResponseMiddleware(RespondingSendingResponseMiddlewareFixture),
            add: (route: Route): Route =>
                route.withAddedSendingResponseMiddleware(RespondingSendingResponseMiddlewareFixture),
        },
        {
            stage: 'ResponseSent',
            fixture: RecordingResponseSentMiddlewareFixture,
            get: (route: Route): unknown[] => route.getResponseSentMiddleware(),
            set: (route: Route): Route => route.withResponseSentMiddleware(RecordingResponseSentMiddlewareFixture),
            add: (route: Route): Route => route.withAddedResponseSentMiddleware(RecordingResponseSentMiddlewareFixture),
        },
    ])('$stage middleware', ({ fixture, get, set, add }) => {
        it('replaces the stage list', () => {
            const route = RouteFixture.make();

            expect(get(set(route))).toEqual([fixture]);
            expect(get(route)).toEqual([]);
        });

        it('appends to the stage list, never deduplicating', () => {
            // Middleware is appended, never deduplicated — scheduling the same class twice runs it
            // twice, in every protocol and every port. See architecture/AGENTS.md §2.
            expect(get(add(add(RouteFixture.make())))).toEqual([fixture, fixture]);
        });
    });
});
