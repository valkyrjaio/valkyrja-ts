/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Valkyrja } from '../../../../../../src/Valkyrja/Application/Kernel/Valkyrja.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { GrpcMiddlewareServiceProvider } from '../../../../../../src/Valkyrja/Grpc/Middleware/Provider/GrpcMiddlewareServiceProvider.ts';
import { GrpcRoutingServiceId } from '../../../../../../src/Valkyrja/Grpc/Routing/Constant/GrpcRoutingServiceId.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Grpc/Routing/Collection/RouteCollection.ts';
import { Router } from '../../../../../../src/Valkyrja/Grpc/Routing/Dispatcher/Router.ts';
import { GrpcRoutingComponentProvider } from '../../../../../../src/Valkyrja/Grpc/Routing/Provider/GrpcRoutingComponentProvider.ts';
import { GrpcRoutingServiceProvider } from '../../../../../../src/Valkyrja/Grpc/Routing/Provider/GrpcRoutingServiceProvider.ts';
import { GrpcConfigFixture } from '../../../../Fixtures/Grpc/GrpcConfigFixture.ts';
import { GrpcRouteComponentProviderFixture } from '../../../../Fixtures/Application/Provider/GrpcRouteComponentProviderFixture.ts';

const bootedContainer = (...providers: GrpcRouteComponentProviderFixture[]): Container => {
    const container = new Container();
    const config = GrpcConfigFixture.withProviders(...providers);
    const app = new Valkyrja(container, config);

    container.setSingleton(ApplicationServiceId.ApplicationContract, app);
    container.setSingleton(ApplicationServiceId.GrpcConfigContract, config);

    for (const publish of Object.values(new GrpcMiddlewareServiceProvider().publishers())) {
        publish(container);
    }

    return container;
};

describe('GrpcRoutingServiceProvider', () => {
    it('publishes the router and the service map', () => {
        expect(Object.keys(new GrpcRoutingServiceProvider().publishers())).toHaveLength(2);
    });

    it('publishes the service map, empty when no provider contributes routes', () => {
        const container = bootedContainer();

        GrpcRoutingServiceProvider.publishRouteCollection(container);

        const collection = container.getSingleton<RouteCollection>(GrpcRoutingServiceId.RouteCollectionContract);

        expect(collection).toBeInstanceOf(RouteCollection);
        expect(collection.all().size).toBe(0);
    });

    it('collects routes from every registered gRPC route provider', () => {
        const container = bootedContainer(new GrpcRouteComponentProviderFixture());

        GrpcRoutingServiceProvider.publishRouteCollection(container);

        // The fixture provider contributes no routes, so the map stays empty — what this proves is
        // that the provider was reached and drained without throwing.
        expect(container.getSingleton<RouteCollection>(GrpcRoutingServiceId.RouteCollectionContract).all().size).toBe(
            0,
        );
    });

    it('publishes the router wired to the shared stage handlers', () => {
        const container = bootedContainer();

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
        expect(provider.getGrpcProviders(app)).toEqual([]);
    });
});
