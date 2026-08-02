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
import { GrpcRoutingServiceId } from '../Constant/GrpcRoutingServiceId.ts';
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
import type { RouterContract } from '../Dispatcher/Contract/RouterContract.ts';

/** Publishes the gRPC `Router` and service map into the container. */
export class GrpcRoutingServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [GrpcRoutingServiceId.RouterContract]: GrpcRoutingServiceProvider.publishRouter,
            [GrpcRoutingServiceId.RouteCollectionContract]: GrpcRoutingServiceProvider.publishRouteCollection,
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

    static publishRouteCollection(this: void, container: ContainerContract): void {
        const collection = new RouteCollection();

        container.setSingleton<RouteCollectionContract>(GrpcRoutingServiceId.RouteCollectionContract, collection);

        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        for (const provider of app.getGrpcProviders()) {
            collection.add(...provider.getRoutes());
        }
    }
}
