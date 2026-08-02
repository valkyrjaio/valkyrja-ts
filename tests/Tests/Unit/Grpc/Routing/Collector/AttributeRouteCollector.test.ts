/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { StatusCode } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Method } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/Method.ts';
import { Middleware } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/Method/Middleware.ts';
import {
    createGrpcMethodDefinition,
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
}

function mw(prototype: Record<string, () => void>): GrpcMiddlewareClass {
    const middleware = class {};

    Object.assign(middleware.prototype, prototype);

    return middleware as unknown as GrpcMiddlewareClass;
}

const MatchedMiddleware = mw({ routeMatched: () => undefined });
const DispatchedMiddleware = mw({ routeDispatched: () => undefined });
const CaughtMiddleware = mw({ throwableCaught: () => undefined });
const SendingMiddleware = mw({ sendingResponse: () => undefined });
const SentMiddleware = mw({ responseSent: () => undefined });
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
            Method({ name: 'Ping' })(undefined, methodDecoratorContext('ping', metadata));
        });

        expect(new AttributeRouteCollector().getRoutes(controller)).toStrictEqual([]);
    });

    it('builds a route keyed by service and method, resolving the handler reference', async () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Method({ name: 'Ping', handler: [() => GrpcRouteProvider, 'pingHandler'] })(
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
            Method({ name: 'Echo', clientStreaming: true, serverStreaming: true })(
                undefined,
                methodDecoratorContext('echo', metadata),
            );
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.isClientStreaming()).toBe(true);
        expect(route?.isServerStreaming()).toBe(true);
    });

    it('builds every method a controller declares, across methods and stacked decorators', () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Method({ name: 'Ping' })(undefined, methodDecoratorContext('ping', metadata));
            Method({ name: 'PingAlias' })(undefined, methodDecoratorContext('ping', metadata));
            Method({ name: 'Echo' })(undefined, methodDecoratorContext('echo', metadata));
        });

        expect(new AttributeRouteCollector().getRoutes(controller).map((route) => route.getMethod())).toStrictEqual([
            '/pkg.Ping/Ping',
            '/pkg.Ping/PingAlias',
            '/pkg.Ping/Echo',
        ]);
    });

    it('falls back to the controller static method of the same name', async () => {
        class PingController {
            static ping(): Promise<ServiceResponseContract> {
                return Promise.resolve(pong);
            }
        }

        const metadata = {} as DecoratorMetadataObject;
        Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
        Method({ name: 'Ping' })(undefined, methodDecoratorContext('ping', metadata));
        attachMetadata(PingController, metadata);

        const [route] = new AttributeRouteCollector().getRoutes(PingController);

        await expect(route?.getHandler()(container, route)).resolves.toBe(pong);
    });

    it('falls back to an UNIMPLEMENTED handler when the controller declares no such static method', async () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Method({ name: 'Ping' })(undefined, methodDecoratorContext('ping', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);
        const response = await route?.getHandler()(container, route);

        expect(response?.getStatus().getCode()).toBe(StatusCode.UNIMPLEMENTED);
    });

    it('falls back to an UNIMPLEMENTED handler when the referenced method is missing', async () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            // `GrpcHandlerKeys` makes an unknown method name a compile error at the decorator, so
            // the collector's missing-method guard is reachable only through the loose storage form
            // (for example, stale generated metadata).
            const definition = createGrpcMethodDefinition({ name: 'Ping' });
            definition.handler = [() => GrpcRouteProvider, 'missingHandler'];

            ensureGrpcMethodMetadata(metadata, 'ping').methods.push(definition);
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);
        const response = await route?.getHandler()(container, route);

        expect(response?.getStatus().getCode()).toBe(StatusCode.UNIMPLEMENTED);
    });

    it('routes each middleware into every stage bucket it satisfies', () => {
        const controller = controllerWith((metadata) => {
            Service('pkg.Ping')(undefined, classDecoratorContext('PingController', metadata));
            Method({ name: 'Ping', middleware: [() => MatchedMiddleware] })(
                undefined,
                methodDecoratorContext('ping', metadata),
            );
            Middleware(() => DispatchedMiddleware)(undefined, methodDecoratorContext('ping', metadata));
            Middleware(() => CaughtMiddleware)(undefined, methodDecoratorContext('ping', metadata));
            Middleware(() => SendingMiddleware)(undefined, methodDecoratorContext('ping', metadata));
            Middleware(() => SentMiddleware)(undefined, methodDecoratorContext('ping', metadata));
            Middleware(() => NoopMiddleware)(undefined, methodDecoratorContext('ping', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getRouteMatchedMiddleware()).toStrictEqual([MatchedMiddleware]);
        expect(route?.getRouteDispatchedMiddleware()).toStrictEqual([DispatchedMiddleware]);
        expect(route?.getThrowableCaughtMiddleware()).toStrictEqual([CaughtMiddleware]);
        expect(route?.getSendingResponseMiddleware()).toStrictEqual([SendingMiddleware]);
        expect(route?.getResponseSentMiddleware()).toStrictEqual([SentMiddleware]);
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
            Method({ name: 'Ping' })(undefined, methodDecoratorContext('ping', metadata));
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
