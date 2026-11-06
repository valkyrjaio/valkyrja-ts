/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.ts';
import { GrpcMiddlewareServiceId } from '../../Middleware/Constant/GrpcMiddlewareServiceId.ts';
import { RouteCollection } from '../Collection/RouteCollection.ts';
import { AttributeRouteCollector } from '../Collector/AttributeRouteCollector.ts';
import { GrpcRoutingServiceId } from '../Constant/GrpcRoutingServiceId.ts';
import { GrpcRoutingData } from '../Data/GrpcRoutingData.ts';
import { Router } from '../Dispatcher/Router.ts';

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import type { ResponseSentHandlerContract } from '../../Middleware/Handler/Contract/ResponseSentHandlerContract.ts';
import type { RouteDispatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.ts';
import type { RouteMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';
import type { RouteNotMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteNotMatchedHandlerContract.ts';
import type { SendingResponseHandlerContract } from '../../Middleware/Handler/Contract/SendingResponseHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.ts';
import type { RouteCollectorContract } from '../Collector/Contract/RouteCollectorContract.ts';
import type { RouterContract } from '../Dispatcher/Contract/RouterContract.ts';

export class GrpcRoutingServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [GrpcRoutingServiceId.RouterContract]: GrpcRoutingServiceProvider.publishRouter,
            [GrpcRoutingServiceId.RouteCollectionContract]: GrpcRoutingServiceProvider.publishRouteCollection,
            [GrpcRoutingServiceId.RouteCollectorContract]: GrpcRoutingServiceProvider.publishAttributeRouteCollector,
            [GrpcRoutingServiceId.GrpcRoutingData]: GrpcRoutingServiceProvider.publishData,
        };
    }

    static publishRouter(this: void, container: ContainerContract): void {
        container.setSingleton<RouterContract>(
            GrpcRoutingServiceId.RouterContract,
            new Router(
                container,
                container.getSingleton<RouteCollectionContract>(GrpcRoutingServiceId.RouteCollectionContract),
                container.getSingleton<RouteMatchedHandlerContract>(
                    GrpcMiddlewareServiceId.RouteMatchedHandlerContract,
                ),
                container.getSingleton<RouteNotMatchedHandlerContract>(
                    GrpcMiddlewareServiceId.RouteNotMatchedHandlerContract,
                ),
                container.getSingleton<RouteDispatchedHandlerContract>(
                    GrpcMiddlewareServiceId.RouteDispatchedHandlerContract,
                ),
                container.getSingleton<ThrowableCaughtHandlerContract>(
                    GrpcMiddlewareServiceId.ThrowableCaughtHandlerContract,
                ),
                container.getSingleton<SendingResponseHandlerContract>(
                    GrpcMiddlewareServiceId.SendingResponseHandlerContract,
                ),
                container.getSingleton<ResponseSentHandlerContract>(
                    GrpcMiddlewareServiceId.ResponseSentHandlerContract,
                ),
            ),
        );
    }

    static publishAttributeRouteCollector(this: void, container: ContainerContract): void {
        container.setSingleton<RouteCollectorContract>(
            GrpcRoutingServiceId.RouteCollectorContract,
            new AttributeRouteCollector(),
        );
    }

    /**
     * Publish the service map.
     *
     * Debug mode walks every route provider and scans every controller they declare. Otherwise the generated
     * `GrpcRoutingData` is read straight into the collection, so a boot pays no collection cost.
     * This mirrors the CLI provider and the HTTP provider — cache is a cold-start optimization, not
     * a correctness requirement.
     */
    static publishRouteCollection(this: void, container: ContainerContract): void {
        const collection = new RouteCollection();

        container.setSingleton<RouteCollectionContract>(GrpcRoutingServiceId.RouteCollectionContract, collection);

        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        if (app.getDebugMode()) {
            GrpcRoutingServiceProvider.publishData(container);

            return;
        }

        collection.setFromData(container.getSingleton<GrpcRoutingData>(GrpcRoutingServiceId.GrpcRoutingData));
    }

    /**
     * Build the service map from every registered route provider and every controller the providers
     * declare, then publish it as the data cache.
     */
    static publishData(this: void, container: ContainerContract): void {
        const collection = container.getSingleton<RouteCollectionContract>(
            GrpcRoutingServiceId.RouteCollectionContract,
        );
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        const controllers: Array<new (...args: unknown[]) => unknown> = [];

        for (const provider of app.getGrpcProviders()) {
            controllers.push(...provider.getControllerClasses());
            collection.add(...provider.getRoutes());
        }

        if (controllers.length > 0) {
            const collector = container.getSingleton<RouteCollectorContract>(
                GrpcRoutingServiceId.RouteCollectorContract,
            );

            collection.add(...collector.getRoutes(...controllers));
        }

        container.setSingleton(GrpcRoutingServiceId.GrpcRoutingData, collection.getData());
    }
}
