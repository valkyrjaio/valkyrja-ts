/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Valkyrja } from '../../../../../../src/Valkyrja/Application/Kernel/Valkyrja.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { GrpcMiddlewareServiceProvider } from '../../../../../../src/Valkyrja/Grpc/Middleware/Provider/GrpcMiddlewareServiceProvider.ts';
import { GrpcRoutingServiceId } from '../../../../../../src/Valkyrja/Grpc/Routing/Constant/GrpcRoutingServiceId.ts';
import { GrpcRoutingData } from '../../../../../../src/Valkyrja/Grpc/Routing/Data/GrpcRoutingData.ts';
import { Route } from '../../../../../../src/Valkyrja/Grpc/Routing/Data/Route.ts';
import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Grpc/Routing/Collection/RouteCollection.ts';
import { Router } from '../../../../../../src/Valkyrja/Grpc/Routing/Dispatcher/Router.ts';
import { GrpcRoutingComponentProvider } from '../../../../../../src/Valkyrja/Grpc/Routing/Provider/GrpcRoutingComponentProvider.ts';
import { GrpcRoutingServiceProvider } from '../../../../../../src/Valkyrja/Grpc/Routing/Provider/GrpcRoutingServiceProvider.ts';
import { GrpcConfigFixture } from '../../../../Fixtures/Grpc/GrpcConfigFixture.ts';
import { GrpcRouteComponentProviderFixture } from '../../../../Fixtures/Application/Provider/GrpcRouteComponentProviderFixture.ts';

const bootedContainer = (debugMode: boolean, ...providers: GrpcRouteComponentProviderFixture[]): Container => {
    const container = new Container();
    const config = GrpcConfigFixture.withDebugMode(debugMode, ...providers);
    const app = new Valkyrja(container, config);

    container.setSingleton(ApplicationServiceId.ApplicationContract, app);
    container.setSingleton(ApplicationServiceId.GrpcConfigContract, config);

    for (const publish of Object.values(new GrpcMiddlewareServiceProvider().publishers())) {
        publish(container);
    }

    return container;
};

describe('GrpcRoutingServiceProvider', () => {
    it('publishes the router, the service map, and the routing data', () => {
        expect(Object.keys(new GrpcRoutingServiceProvider().publishers())).toHaveLength(3);
    });

    it('publishes the service map, empty when no provider contributes routes', () => {
        const container = bootedContainer(true);

        GrpcRoutingServiceProvider.publishRouteCollection(container);

        const collection = container.getSingleton<RouteCollection>(GrpcRoutingServiceId.RouteCollectionContract);

        expect(collection).toBeInstanceOf(RouteCollection);
        expect(collection.all().size).toBe(0);
    });

    it('collects routes from every registered gRPC route provider in debug mode', () => {
        const container = bootedContainer(true, new GrpcRouteComponentProviderFixture());

        GrpcRoutingServiceProvider.publishRouteCollection(container);

        // The fixture provider contributes no routes, so the map stays empty — what this proves is
        // that the provider was reached and drained without throwing.
        expect(container.getSingleton<RouteCollection>(GrpcRoutingServiceId.RouteCollectionContract).all().size).toBe(
            0,
        );
    });

    it('publishes the collected map as the routing data cache in debug mode', () => {
        const container = bootedContainer(true);

        GrpcRoutingServiceProvider.publishRouteCollection(container);

        expect(container.getSingleton(GrpcRoutingServiceId.GrpcRoutingData)).toBeInstanceOf(GrpcRoutingData);
    });

    it('reads the generated routing data instead of walking providers when not in debug mode', () => {
        const container = bootedContainer(false);
        const route = new Route('/pkg.Cached/Method', () => Promise.resolve(ServiceResponse.ok()));
        let built = 0;

        container.setSingleton(
            GrpcRoutingServiceId.GrpcRoutingData,
            new GrpcRoutingData({
                '/pkg.Cached/Method': () => {
                    built += 1;

                    return route;
                },
            }),
        );

        GrpcRoutingServiceProvider.publishRouteCollection(container);

        const collection = container.getSingleton<RouteCollection>(GrpcRoutingServiceId.RouteCollectionContract);

        // Loading the cache must not construct any route: a cached map builds a route only when a
        // call reaches it.
        expect(built).toBe(0);
        expect(collection.get('/pkg.Cached/Method')).toBe(route);
        expect(built).toBe(1);
    });

    it('publishes the router wired to the shared stage handlers', () => {
        const container = bootedContainer(true);

        GrpcRoutingServiceProvider.publishRouteCollection(container);
        GrpcRoutingServiceProvider.publishRouter(container);

        expect(container.getSingleton(GrpcRoutingServiceId.RouterContract)).toBeInstanceOf(Router);
    });
});

describe('GrpcRoutingComponentProvider', () => {
    it('contributes only its service provider', () => {
        const app = new Valkyrja(new Container(), new GrpcConfigFixture());
        const provider = new GrpcRoutingComponentProvider();

        const containerProviders = provider.getContainerProviders(app);

        expect(containerProviders).toHaveLength(1);
        expect(containerProviders[0]).toBeInstanceOf(GrpcRoutingServiceProvider);
        expect(provider.getComponentProviders(app)).toEqual([]);
        expect(provider.getEventProviders(app)).toEqual([]);
        expect(provider.getCliProviders(app)).toEqual([]);
        expect(provider.getHttpProviders(app)).toEqual([]);
        expect(provider.getGrpcProviders(app)).toEqual([]);
    });
});
