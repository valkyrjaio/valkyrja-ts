/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';
import { GrpcRoutingNoRouteHandlerException } from '../../../../../../src/Valkyrja/Grpc/Routing/Throwable/Exception/GrpcRoutingNoRouteHandlerException.ts';
import { RouteHandler } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/Route/RouteHandler.ts';

import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Route } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/Route.ts';
import { Middleware } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/Route/Middleware.ts';
import {
    createGrpcRouteDefinition,
    ensureGrpcMethodMetadata,
} from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/RouteAttributeMetadata.ts';
import { Service } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/Service.ts';
import { AttributeRouteCollector } from '../../../../../../src/Valkyrja/Grpc/Routing/Collector/AttributeRouteCollector.ts';
import {
    attachMetadata,
    classDecoratorContext,
    methodDecoratorContext,
} from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

import type { ContainerContract } from '../../../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ServiceResponseContract } from '../../../../../../src/Valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { GrpcMiddlewareClass } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/RouteAttributeMetadata.ts';

const container = {} as ContainerContract;
const pong = ServiceResponse.ok();

class GrpcRouteProvider {
    static pingHandler(): Promise<ServiceResponseContract> {
        return Promise.resolve(pong);
    }

    static otherHandler(): Promise<ServiceResponseContract> {
        return Promise.resolve(ServiceResponse.ok('other'));
    }
}

function mw(prototype: Record<string, () => void>): GrpcMiddlewareClass {
    const middleware = class {};

    Object.assign(middleware.prototype, prototype);

    return middleware as unknown as GrpcMiddlewareClass;
}

const NoopMiddleware = mw({});

function controllerWith(apply: (metadata: DecoratorMetadataObject) => void): new () => unknown {
    const metadata = {} as DecoratorMetadataObject;
    apply(metadata);

    return attachMetadata(class Controller {}, metadata);
}

describe('Grpc AttributeRouteCollector', () => {
    it('returns no routes for a class without decorator metadata', () => {
        class Bare {}

        expect(new AttributeRouteCollector().getRoutes(Bare)).toStrictEqual([]);
    });

    it('returns no routes for a controller that declares no service', () => {
        const controller = controllerWith((metadata) => {
            Route({ name: 'Ping' })(undefined, methodDecoratorContext('ping', metadata));
        });

        expect(new AttributeRouteCollector().getRoutes(controller)).toStrictEqual([]);
    });

    it('builds a route keyed by service and method, resolving the handler reference', async () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Route({ name: 'Ping', handler: [() => GrpcRouteProvider, 'pingHandler'] })(
                undefined,
                methodDecoratorContext('ping', metadata),
            );
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getMethod()).toBe('/pkg.Ping/Ping');
        expect(route?.getService()).toBe('pkg.Ping');
        expect(route?.getMethodName()).toBe('Ping');
        expect(route?.isClientStreaming()).toBe(false);
        expect(route?.isServerStreaming()).toBe(false);
        await expect(route?.getHandler()(container, route)).resolves.toBe(pong);
    });

    it('carries the streaming flags onto the route', () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Route({
                name: 'Echo',
                handler: [() => GrpcRouteProvider, 'pingHandler'],
                clientStreaming: true,
                serverStreaming: true,
            })(undefined, methodDecoratorContext('echo', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.isClientStreaming()).toBe(true);
        expect(route?.isServerStreaming()).toBe(true);
    });

    it('builds every method a controller declares, across methods and stacked decorators', () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Route({ name: 'Ping', handler: [() => GrpcRouteProvider, 'pingHandler'] })(
                undefined,
                methodDecoratorContext('ping', metadata),
            );
            Route({ name: 'PingAlias', handler: [() => GrpcRouteProvider, 'pingHandler'] })(
                undefined,
                methodDecoratorContext('ping', metadata),
            );
            Route({ name: 'Echo', handler: [() => GrpcRouteProvider, 'pingHandler'] })(
                undefined,
                methodDecoratorContext('echo', metadata),
            );
        });

        expect(new AttributeRouteCollector().getRoutes(controller).map((route) => route.getMethod())).toStrictEqual([
            '/pkg.Ping/Ping',
            '/pkg.Ping/PingAlias',
            '/pkg.Ping/Echo',
        ]);
    });

    it('prefers the RouteHandler decorator over the handler option', async () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Route({ name: 'Ping', handler: [() => GrpcRouteProvider, 'otherHandler'] })(
                undefined,
                methodDecoratorContext('ping', metadata),
            );
            RouteHandler([() => GrpcRouteProvider, 'pingHandler'])(undefined, methodDecoratorContext('ping', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        // `pingHandler` answers `pong`; `otherHandler` answers something else, so the assertion
        // fails for an implementation that reads the option instead of the decorator.
        await expect(route?.getHandler()(container, route)).resolves.toBe(pong);
    });

    it('rejects a route that names no handler', () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Route({ name: 'Ping' })(undefined, methodDecoratorContext('ping', metadata));
        });

        expect(() => new AttributeRouteCollector().getRoutes(controller)).toThrow(GrpcRoutingNoRouteHandlerException);
    });

    it('rejects a route whose named handler the referenced class does not declare', () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            // `GrpcHandlerKeys` makes an unknown method name a compile error at the decorator, so
            // this guard is reachable only through the loose storage form, such as stale generated
            // metadata.
            const definition = createGrpcRouteDefinition({ name: 'Ping' });
            definition.handler = [() => GrpcRouteProvider, 'missingHandler'];

            ensureGrpcMethodMetadata(metadata, 'ping').routes.push(definition);
        });

        expect(() => new AttributeRouteCollector().getRoutes(controller)).toThrow(GrpcRoutingNoRouteHandlerException);
    });

    it('adds each per-stage argument to the stage that argument names', () => {
        // Each stage gets its own class, so an argument wired to the wrong stage fails rather
        // than passing on a value a sibling stage also holds.
        const Matched = mw({});
        const Dispatched = mw({});
        const Caught = mw({});
        const Sending = mw({});
        const Sent = mw({});

        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Route({
                name: 'Ping',
                handler: [() => GrpcRouteProvider, 'pingHandler'],
                routeMatchedMiddleware: [() => Matched],
                routeDispatchedMiddleware: [() => Dispatched],
                throwableCaughtMiddleware: [() => Caught],
                sendingResponseMiddleware: [() => Sending],
                responseSentMiddleware: [() => Sent],
            })(undefined, methodDecoratorContext('ping', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getRouteMatchedMiddleware()).toStrictEqual([Matched]);
        expect(route?.getRouteDispatchedMiddleware()).toStrictEqual([Dispatched]);
        expect(route?.getThrowableCaughtMiddleware()).toStrictEqual([Caught]);
        expect(route?.getSendingResponseMiddleware()).toStrictEqual([Sending]);
        expect(route?.getResponseSentMiddleware()).toStrictEqual([Sent]);
    });

    it('carries the request and response message types onto the route', () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Route({
                name: 'Ping',
                handler: [() => GrpcRouteProvider, 'pingHandler'],
                requestType: 'PingRequest' as never,
                responseType: 'PingResponse' as never,
            })(undefined, methodDecoratorContext('ping', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getRequestType()).toBe('PingRequest');
        expect(route?.getResponseType()).toBe('PingResponse');
    });

    it('puts a middleware that serves no stage into no stage', () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Route({ name: 'Ping', handler: [() => GrpcRouteProvider, 'pingHandler'] })(
                undefined,
                methodDecoratorContext('ping', metadata),
            );
            Middleware(() => NoopMiddleware)(undefined, methodDecoratorContext('ping', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getRouteMatchedMiddleware()).toStrictEqual([]);
        expect(route?.getRouteDispatchedMiddleware()).toStrictEqual([]);
        expect(route?.getThrowableCaughtMiddleware()).toStrictEqual([]);
        expect(route?.getSendingResponseMiddleware()).toStrictEqual([]);
        expect(route?.getResponseSentMiddleware()).toStrictEqual([]);
    });

    it('puts one middleware into every stage it serves at once', () => {
        const Every = mw({
            routeMatched: () => undefined,
            routeDispatched: () => undefined,
            throwableCaught: () => undefined,
            sendingResponse: () => undefined,
            responseSent: () => undefined,
        });

        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Route({ name: 'Ping', handler: [() => GrpcRouteProvider, 'pingHandler'] })(
                undefined,
                methodDecoratorContext('ping', metadata),
            );
            Middleware(() => Every)(undefined, methodDecoratorContext('ping', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getRouteMatchedMiddleware()).toStrictEqual([Every]);
        expect(route?.getRouteDispatchedMiddleware()).toStrictEqual([Every]);
        expect(route?.getThrowableCaughtMiddleware()).toStrictEqual([Every]);
        expect(route?.getSendingResponseMiddleware()).toStrictEqual([Every]);
        expect(route?.getResponseSentMiddleware()).toStrictEqual([Every]);
    });
});
