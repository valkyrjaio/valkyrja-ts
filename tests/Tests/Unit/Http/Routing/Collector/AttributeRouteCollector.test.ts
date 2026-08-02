/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { Response } from '../../../../../../src/Valkyrja/Http/Message/Response/Response.ts';
import { DynamicRoute } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/DynamicRoute.ts';
import { Route } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route.ts';
import { Get } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RequestMethod/Get.ts';
import { Middleware } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/Middleware.ts';
import { Name } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/Name.ts';
import { Path } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/Path.ts';
import { RequestStruct } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RequestStruct.ts';
import { ResponseStruct } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/ResponseStruct.ts';
import { RouteHandler } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RouteHandler.ts';
import { ensureHttpRouteMethodMetadata } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { AttributeRouteCollector } from '../../../../../../src/Valkyrja/Http/Routing/Collector/AttributeRouteCollector.ts';
import {
    attachMetadata,
    classDecoratorContext,
    methodDecoratorContext,
} from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

import type { ContainerContract } from '../../../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { DynamicRouteContract } from '../../../../../../src/Valkyrja/Http/Routing/Data/Contract/DynamicRouteContract.ts';
import type { HttpMiddlewareClass } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import type { RequestStructContract } from '../../../../../../src/Valkyrja/Http/Struct/Request/Contract/RequestStructContract.ts';
import type { ResponseStructContract } from '../../../../../../src/Valkyrja/Http/Struct/Response/Contract/ResponseStructContract.ts';

const container = {} as ContainerContract;

class HttpRouteProvider {
    static versionHandler(): Response {
        return Response.create('version');
    }

    static inlineHandler(): Response {
        return Response.create('inline');
    }
}

function mw(prototype: Record<string, () => void>): HttpMiddlewareClass {
    const middleware = class {};
    Object.assign(middleware.prototype, prototype);

    return middleware as unknown as HttpMiddlewareClass;
}

const MatchedMiddleware = mw({ routeMatched: () => undefined });
const DispatchedMiddleware = mw({ routeDispatched: () => undefined });
const CaughtMiddleware = mw({ throwableCaught: () => undefined });
const SendingMiddleware = mw({ sendingResponse: () => undefined });
const ResponseSentMiddleware = mw({ responseSent: () => undefined });
const MultiMiddleware = mw({ routeMatched: () => undefined, responseSent: () => undefined });
const NoopMiddleware = mw({});

/**
 * Build a controller class carrying the given decorator metadata, populated by
 * applying real decorators against a shared synthetic metadata object.
 */
function controllerWith(apply: (metadata: DecoratorMetadataObject) => void): new () => unknown {
    const metadata = {} as DecoratorMetadataObject;
    apply(metadata);

    return attachMetadata(class Controller {}, metadata);
}

describe('AttributeRouteCollector', () => {
    it('returns no routes for a class without decorator metadata', () => {
        class Bare {}

        expect(new AttributeRouteCollector().getRoutes(Bare)).toStrictEqual([]);
    });

    it('builds a route and resolves the handler from the provider reference', () => {
        const controller = controllerWith((metadata) => {
            Route({ path: '/version', name: 'version', requestMethods: [RequestMethod.GET] })(
                undefined,
                methodDecoratorContext('version', metadata),
            );
            RouteHandler([() => HttpRouteProvider, 'versionHandler'])(
                undefined,
                methodDecoratorContext('version', metadata),
            );
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getPath()).toBe('/version');
        expect(route?.getName()).toBe('version');
        expect(route?.getRequestMethods()).toStrictEqual([RequestMethod.GET]);
        expect(route?.getHandler()).toBe(HttpRouteProvider.versionHandler);
    });

    it('falls back to a default handler when no handler reference is present', () => {
        const controller = controllerWith((metadata) => {
            Route({ path: '/text', name: 'text' })(undefined, methodDecoratorContext('text', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getHandler()(container, route)).toBeInstanceOf(Response);
    });

    it('falls back to a default handler when the referenced method is missing', () => {
        const controller = controllerWith((metadata) => {
            Route({ path: '/text', name: 'text' })(undefined, methodDecoratorContext('text', metadata));
            // `HttpHandlerKeys` makes an unknown method name a compile error at the
            // decorator, so the collector's missing-method guard is reachable only
            // through the loose storage form (e.g. stale generated metadata).
            ensureHttpRouteMethodMetadata(metadata, 'text').handler = [() => HttpRouteProvider, 'missingHandler'];
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getHandler()(container, route)).toBeInstanceOf(Response);
    });

    it('prefers the dedicated decorators over inline @Route options when both are set', () => {
        const inlineRequest = { marker: 'inline-request' } as unknown as RequestStructContract;
        const dedicatedRequest = { marker: 'dedicated-request' } as unknown as RequestStructContract;
        const inlineResponse = { marker: 'inline-response' } as unknown as ResponseStructContract;
        const dedicatedResponse = { marker: 'dedicated-response' } as unknown as ResponseStructContract;

        const controller = controllerWith((metadata) => {
            Route({
                path: '/version',
                name: 'version',
                handler: [() => HttpRouteProvider, 'inlineHandler'],
                requestStruct: inlineRequest,
                responseStruct: inlineResponse,
            })(undefined, methodDecoratorContext('version', metadata));
            RouteHandler([() => HttpRouteProvider, 'versionHandler'])(
                undefined,
                methodDecoratorContext('version', metadata),
            );
            RequestStruct(dedicatedRequest)(undefined, methodDecoratorContext('version', metadata));
            ResponseStruct(dedicatedResponse)(undefined, methodDecoratorContext('version', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getHandler()).toBe(HttpRouteProvider.versionHandler);
        expect(route?.getRequestStruct()).toBe(dedicatedRequest);
        expect(route?.getResponseStruct()).toBe(dedicatedResponse);
    });

    it('defaults to HEAD and GET when no request methods are declared', () => {
        const controller = controllerWith((metadata) => {
            Route({ path: '/', name: 'welcome' })(undefined, methodDecoratorContext('welcome', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getRequestMethods()).toStrictEqual([RequestMethod.HEAD, RequestMethod.GET]);
    });

    it('adds request methods contributed by verb decorators', () => {
        const controller = controllerWith((metadata) => {
            Route({ path: '/home', name: 'home' })(undefined, methodDecoratorContext('home', metadata));
            Get()(undefined, methodDecoratorContext('home', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getRequestMethods()).toStrictEqual([RequestMethod.HEAD, RequestMethod.GET]);
    });

    it('applies class and method path and name prefixes', () => {
        const controller = controllerWith((metadata) => {
            Path('/admin')(undefined, classDecoratorContext('AdminController', metadata));
            Name('admin')(undefined, classDecoratorContext('AdminController', metadata));
            Route({ path: '/version', name: 'version' })(undefined, methodDecoratorContext('version', metadata));
            Path('/detail')(undefined, methodDecoratorContext('version', metadata));
            Name('detail')(undefined, methodDecoratorContext('version', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getPath()).toBe('/admin/version/detail');
        expect(route?.getName()).toBe('admin.version.detail');
    });

    it('routes each middleware into every bucket it satisfies', () => {
        const controller = controllerWith((metadata) => {
            Route({ path: '/', name: 'welcome' })(undefined, methodDecoratorContext('welcome', metadata));
            Middleware(() => MatchedMiddleware)(undefined, methodDecoratorContext('welcome', metadata));
            Middleware(() => DispatchedMiddleware)(undefined, methodDecoratorContext('welcome', metadata));
            Middleware(() => CaughtMiddleware)(undefined, methodDecoratorContext('welcome', metadata));
            Middleware(() => SendingMiddleware)(undefined, methodDecoratorContext('welcome', metadata));
            Middleware(() => ResponseSentMiddleware)(undefined, methodDecoratorContext('welcome', metadata));
            Middleware(() => MultiMiddleware)(undefined, methodDecoratorContext('welcome', metadata));
            Middleware(() => NoopMiddleware)(undefined, methodDecoratorContext('welcome', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getRouteMatchedMiddleware()).toStrictEqual([MatchedMiddleware, MultiMiddleware]);
        expect(route?.getRouteDispatchedMiddleware()).toStrictEqual([DispatchedMiddleware]);
        expect(route?.getThrowableCaughtMiddleware()).toStrictEqual([CaughtMiddleware]);
        expect(route?.getSendingResponseMiddleware()).toStrictEqual([SendingMiddleware]);
        expect(route?.getResponseSentMiddleware()).toStrictEqual([ResponseSentMiddleware, MultiMiddleware]);
    });

    it('applies request and response structs', () => {
        const requestStruct = { marker: 'request' } as unknown as RequestStructContract;
        const responseStruct = { marker: 'response' } as unknown as ResponseStructContract;

        const controller = controllerWith((metadata) => {
            Route({ path: '/store', name: 'store' })(undefined, methodDecoratorContext('store', metadata));
            RequestStruct(requestStruct)(undefined, methodDecoratorContext('store', metadata));
            ResponseStruct(responseStruct)(undefined, methodDecoratorContext('store', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);

        expect(route?.getRequestStruct()).toBe(requestStruct);
        expect(route?.getResponseStruct()).toBe(responseStruct);
    });

    it('builds a dynamic route and computes its regex from folded parameters', () => {
        const controller = controllerWith((metadata) => {
            DynamicRoute({
                path: '/{value}',
                name: 'dynamicValue',
                parameters: [{ name: 'value', regex: '[a-zA-Z]+' }],
            })(undefined, methodDecoratorContext('dynamic', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);
        const dynamic = route as DynamicRouteContract;

        expect(dynamic.getPath()).toBe('/{value}');
        expect(dynamic.getRegex()).not.toBe('');
        expect(dynamic.getParameters().map((parameter) => parameter.getName())).toStrictEqual(['value']);
    });

    it('auto-promotes an @Route with a parameter path to a dynamic route', () => {
        const controller = controllerWith((metadata) => {
            Route({
                path: '/{value}',
                name: 'dynamicValue',
                parameters: [{ name: 'value', regex: '[a-zA-Z]+' }],
            })(undefined, methodDecoratorContext('dynamic', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);
        const dynamic = route as DynamicRouteContract;

        expect(dynamic.getRegex()).not.toBe('');
        expect(dynamic.getParameters().map((parameter) => parameter.getName())).toStrictEqual(['value']);
    });

    it('auto-promotes when the parameter comes from the class @Path rather than the route path', () => {
        const controller = controllerWith((metadata) => {
            Path('/{tenant}')(undefined, classDecoratorContext('TenantController', metadata));
            Route({
                path: '/reports',
                name: 'reports',
                parameters: [{ name: 'tenant', regex: '[a-z]+' }],
            })(undefined, methodDecoratorContext('reports', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);
        const dynamic = route as DynamicRouteContract;

        expect(dynamic.getPath()).toBe('/{tenant}/reports');
        expect(dynamic.getRegex()).not.toBe('');
        expect(dynamic.getParameters().map((parameter) => parameter.getName())).toStrictEqual(['tenant']);
    });

    it('auto-promotes when the parameter comes from the method @Path', () => {
        const controller = controllerWith((metadata) => {
            Route({
                path: '/reports',
                name: 'reports',
                parameters: [{ name: 'id', regex: '\\d+' }],
            })(undefined, methodDecoratorContext('reports', metadata));
            Path('/{id}')(undefined, methodDecoratorContext('reports', metadata));
        });

        const [route] = new AttributeRouteCollector().getRoutes(controller);
        const dynamic = route as DynamicRouteContract;

        expect(dynamic.getPath()).toBe('/reports/{id}');
        expect(dynamic.getRegex()).not.toBe('');
    });
});
