/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { DynamicRoute } from '../../../../../../src/Valkyrja/Http/Routing/Data/DynamicRoute.ts';
import { Parameter } from '../../../../../../src/Valkyrja/Http/Routing/Data/Parameter.ts';
import { Cast } from '../../../../../../src/Valkyrja/Type/Data/Cast.ts';
import { TypeFixture } from '../../../../Fixtures/Type/TypeFixture.ts';

import type { DynamicRouteContract } from '../../../../../../src/Valkyrja/Http/Routing/Data/Contract/DynamicRouteContract.ts';
import type { MatcherContract } from '../../../../../../src/Valkyrja/Http/Routing/Matcher/Contract/MatcherContract.ts';
import { HttpMessageServiceId } from '../../../../../../src/Valkyrja/Http/Message/Constant/HttpMessageServiceId.ts';
import { ResponseFactory } from '../../../../../../src/Valkyrja/Http/Message/Response/Factory/ResponseFactory.ts';
import { HttpMiddlewareServiceId } from '../../../../../../src/Valkyrja/Http/Middleware/Constant/HttpMiddlewareServiceId.ts';
import { ResponseSentHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/ResponseSentHandler.ts';
import { RouteDispatchedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RouteDispatchedHandler.ts';
import { RouteMatchedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RouteMatchedHandler.ts';
import { RouteNotMatchedHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/RouteNotMatchedHandler.ts';
import { SendingResponseHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/SendingResponseHandler.ts';
import { ThrowableCaughtHandler } from '../../../../../../src/Valkyrja/Http/Middleware/Handler/ThrowableCaughtHandler.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Http/Routing/Collection/RouteCollection.ts';
import { AttributeRouteCollector } from '../../../../../../src/Valkyrja/Http/Routing/Collector/AttributeRouteCollector.ts';
import { HttpRoutingServiceId } from '../../../../../../src/Valkyrja/Http/Routing/Constant/HttpRoutingServiceId.ts';
import { HttpRoutingData } from '../../../../../../src/Valkyrja/Http/Routing/Data/HttpRoutingData.ts';
import { Route } from '../../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';
import { Router } from '../../../../../../src/Valkyrja/Http/Routing/Dispatcher/Router.ts';
import { RoutingResponseFactory } from '../../../../../../src/Valkyrja/Http/Routing/Factory/RoutingResponseFactory.ts';
import { Matcher } from '../../../../../../src/Valkyrja/Http/Routing/Matcher/Matcher.ts';
import { Processor } from '../../../../../../src/Valkyrja/Http/Routing/Processor/Processor.ts';
import { Url } from '../../../../../../src/Valkyrja/Http/Routing/Url/Url.ts';
import { HttpRoutingServiceProvider } from '../../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingServiceProvider.ts';
import { HtmlResponse } from '../../../../../../src/Valkyrja/Http/Message/Response/HtmlResponse.ts';

import { Route as RouteAttribute } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route.ts';
import { RouteHandler } from '../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RouteHandler.ts';
import { attachMetadata, methodDecoratorContext } from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { HttpRouteProviderContract } from '../../../../../../src/Valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';

class WelcomeRouteProvider implements HttpRouteProviderContract {
    getControllerClasses(): Array<new (...args: unknown[]) => unknown> {
        return [];
    }

    getRoutes(): Route[] {
        return [new Route('/', 'welcome', () => new HtmlResponse('<h1>Welcome!</h1>'))];
    }
}

class HomeController {
    static homeHandler(): HtmlResponse {
        return new HtmlResponse('<h1>Home</h1>');
    }
}

const homeControllerMetadata = {} as DecoratorMetadataObject;
RouteAttribute({ path: '/home', name: 'home' })(undefined, methodDecoratorContext('home', homeControllerMetadata));
RouteHandler([() => HomeController, 'homeHandler'])(undefined, methodDecoratorContext('home', homeControllerMetadata));
attachMetadata(HomeController, homeControllerMetadata);

class ControllerRouteProvider implements HttpRouteProviderContract {
    getControllerClasses(): Array<new (...args: unknown[]) => unknown> {
        return [HomeController];
    }

    getRoutes(): Route[] {
        return [];
    }

    static noop(): HtmlResponse {
        return new HtmlResponse('<h1>Home</h1>');
    }
}

function appStub(debugMode: boolean, httpProviders: HttpRouteProviderContract[] = []): ApplicationContract {
    return {
        getDebugMode: () => debugMode,
        getHttpProviders: () => httpProviders,
    } as unknown as ApplicationContract;
}

function baseContainer(app: ApplicationContract): Container {
    const container = new Container();

    container.setSingleton(ApplicationServiceId.ApplicationContract, app);
    container.setSingleton(HttpMessageServiceId.ResponseFactoryContract, new ResponseFactory());

    return container;
}

describe('HttpRoutingServiceProvider', () => {
    it('publishes all routing ids', () => {
        const publishers = new HttpRoutingServiceProvider().publishers();

        expect(Object.keys(publishers)).toHaveLength(8);
    });

    it('publishAttributeRouteCollector registers the attribute collector', () => {
        const container = baseContainer(appStub(true));
        container.setSingleton(HttpRoutingServiceId.ProcessorContract, new Processor());

        HttpRoutingServiceProvider.publishAttributeRouteCollector(container);

        expect(container.getSingleton(HttpRoutingServiceId.RouteCollectorContract)).toBeInstanceOf(
            AttributeRouteCollector,
        );
    });

    it('publishData collects decorator routes from controller classes', () => {
        const container = baseContainer(appStub(true, [new ControllerRouteProvider()]));
        container.setSingleton(HttpRoutingServiceId.RouteCollectionContract, new RouteCollection());
        container.setSingleton(HttpRoutingServiceId.ProcessorContract, new Processor());
        container.setSingleton(
            HttpRoutingServiceId.RouteCollectorContract,
            new AttributeRouteCollector(new Processor()),
        );

        HttpRoutingServiceProvider.publishData(container);

        const collection = container.getSingleton<RouteCollection>(HttpRoutingServiceId.RouteCollectionContract);
        expect(collection.hasName('home')).toBe(true);
    });

    it('publishProcessor registers a processor', () => {
        const container = baseContainer(appStub(true));

        HttpRoutingServiceProvider.publishProcessor(container);

        expect(container.getSingleton(HttpRoutingServiceId.ProcessorContract)).toBeInstanceOf(Processor);
    });

    it('publishMatcher registers a matcher', () => {
        const container = baseContainer(appStub(true));
        container.setSingleton(HttpRoutingServiceId.RouteCollectionContract, new RouteCollection());

        HttpRoutingServiceProvider.publishMatcher(container);

        expect(container.getSingleton(HttpRoutingServiceId.MatcherContract)).toBeInstanceOf(Matcher);
    });

    it('publishMatcher gives the matcher the container, so a cast applies', () => {
        const container = baseContainer(appStub(true));
        const collection = new RouteCollection();
        collection.add(
            new DynamicRoute(
                '/users/{id}',
                'users.show',
                '/users/(?<id>\\d+)',
                [new Parameter('id', '\\d+').withCast(new Cast(TypeFixture.name))],
                () => {
                    throw new Error('not dispatched');
                },
                [RequestMethod.GET],
            ),
        );
        container.setSingleton(HttpRoutingServiceId.RouteCollectionContract, collection);
        container.bind(TypeFixture.name, TypeFixture.make);

        HttpRoutingServiceProvider.publishMatcher(container);

        const matcher = container.getSingleton<MatcherContract>(HttpRoutingServiceId.MatcherContract);
        const route = matcher.match('/users/42', RequestMethod.GET) as DynamicRouteContract;

        expect(route.getParameters()[0]?.getValue()).toBe('cast:42');
    });

    it('publishUrl registers a url generator', () => {
        const container = baseContainer(appStub(true));
        container.setSingleton(HttpRoutingServiceId.RouteCollectionContract, new RouteCollection());

        HttpRoutingServiceProvider.publishUrl(container);

        expect(container.getSingleton(HttpRoutingServiceId.UrlContract)).toBeInstanceOf(Url);
    });

    it('publishResponseFactory registers a routing response factory', () => {
        const container = baseContainer(appStub(true));
        container.setSingleton(HttpRoutingServiceId.UrlContract, new Url(new RouteCollection()));

        HttpRoutingServiceProvider.publishResponseFactory(container);

        expect(container.getSingleton(HttpRoutingServiceId.RoutingResponseFactory)).toBeInstanceOf(
            RoutingResponseFactory,
        );
    });

    it('publishRouter registers a router', () => {
        const container = baseContainer(appStub(true));
        container.setSingleton(HttpRoutingServiceId.MatcherContract, new Matcher(new RouteCollection()));
        container.setSingleton(
            HttpMiddlewareServiceId.ThrowableCaughtHandlerContract,
            new ThrowableCaughtHandler(container),
        );
        container.setSingleton(HttpMiddlewareServiceId.RouteMatchedHandlerContract, new RouteMatchedHandler(container));
        container.setSingleton(
            HttpMiddlewareServiceId.RouteNotMatchedHandlerContract,
            new RouteNotMatchedHandler(container),
        );
        container.setSingleton(
            HttpMiddlewareServiceId.RouteDispatchedHandlerContract,
            new RouteDispatchedHandler(container),
        );
        container.setSingleton(
            HttpMiddlewareServiceId.SendingResponseHandlerContract,
            new SendingResponseHandler(container),
        );
        container.setSingleton(HttpMiddlewareServiceId.ResponseSentHandlerContract, new ResponseSentHandler(container));

        HttpRoutingServiceProvider.publishRouter(container);

        expect(container.getSingleton(HttpRoutingServiceId.RouterContract)).toBeInstanceOf(Router);
    });

    it('publishData collects routes from the http route providers', () => {
        const container = baseContainer(appStub(true, [new WelcomeRouteProvider()]));
        container.setSingleton(HttpRoutingServiceId.RouteCollectionContract, new RouteCollection());
        container.setSingleton(HttpRoutingServiceId.ProcessorContract, new Processor());

        HttpRoutingServiceProvider.publishData(container);

        const data = container.getSingleton<HttpRoutingData>(HttpRoutingServiceId.HttpRoutingData);
        expect(data).toBeInstanceOf(HttpRoutingData);
        expect(data.paths['GET']?.['/']).toBe('welcome');
    });

    it('publishRouteCollection discovers routes in debug mode', () => {
        const container = baseContainer(appStub(true, [new WelcomeRouteProvider()]));
        container.setSingleton(HttpRoutingServiceId.ProcessorContract, new Processor());

        HttpRoutingServiceProvider.publishRouteCollection(container);

        const collection = container.getSingleton<RouteCollection>(HttpRoutingServiceId.RouteCollectionContract);
        expect(collection.hasName('welcome')).toBe(true);
    });

    it('publishRouteCollection loads generated data when not in debug mode', () => {
        const container = baseContainer(appStub(false));
        const route = new Route('/', 'welcome', () => new HtmlResponse('<h1>Welcome!</h1>'));
        const seeded = new RouteCollection();
        seeded.add(route);
        container.setSingleton(HttpRoutingServiceId.HttpRoutingData, seeded.getData());

        HttpRoutingServiceProvider.publishRouteCollection(container);

        const collection = container.getSingleton<RouteCollection>(HttpRoutingServiceId.RouteCollectionContract);
        expect(collection.hasName('welcome')).toBe(true);
    });
});
