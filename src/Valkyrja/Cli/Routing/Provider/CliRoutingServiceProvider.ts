import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.js';
import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.js';
import { CliInteractionServiceId } from '../../Interaction/Constant/CliInteractionServiceId.js';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.js';
import { CliMiddlewareServiceId } from '../../Middleware/Constant/CliMiddlewareServiceId.js';
import type { ExitedHandlerContract } from '../../Middleware/Handler/Contract/ExitedHandlerContract.js';
import type { RouteDispatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.js';
import type { RouteMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteMatchedHandlerContract.js';
import type { RouteNotMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteNotMatchedHandlerContract.js';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.js';
import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.js';
import { RouteCollection } from '../Collection/RouteCollection.js';
import { CliRoutingServiceId } from '../Constant/CliRoutingServiceId.js';
import { CliRoutingData } from '../Data/CliRoutingData.js';
import type { RouterContract } from '../Dispatcher/Contract/RouterContract.js';
import { Router } from '../Dispatcher/Router.js';

export class CliRoutingServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [CliRoutingServiceId.RouterContract]: CliRoutingServiceProvider.publishRouter,
            [CliRoutingServiceId.RouteCollectionContract]: CliRoutingServiceProvider.publishRouteCollection,
            [CliRoutingServiceId.CliRoutingData]: CliRoutingServiceProvider.publishData,
        };
    }

    static publishRouter(this: void, container: ContainerContract): void {
        container.setSingleton<RouterContract>(
            CliRoutingServiceId.RouterContract,
            new Router(
                container,
                container.getSingleton<RouteCollectionContract>(CliRoutingServiceId.RouteCollectionContract),
                container.getSingleton<OutputFactoryContract>(CliInteractionServiceId.OutputFactoryContract),
                container.getSingleton<ThrowableCaughtHandlerContract>(
                    CliMiddlewareServiceId.ThrowableCaughtHandlerContract,
                ),
                container.getSingleton<RouteMatchedHandlerContract>(CliMiddlewareServiceId.RouteMatchedHandlerContract),
                container.getSingleton<RouteNotMatchedHandlerContract>(
                    CliMiddlewareServiceId.RouteNotMatchedHandlerContract,
                ),
                container.getSingleton<RouteDispatchedHandlerContract>(
                    CliMiddlewareServiceId.RouteDispatchedHandlerContract,
                ),
                container.getSingleton<ExitedHandlerContract>(CliMiddlewareServiceId.ExitedHandlerContract),
            ),
        );
    }

    static publishRouteCollection(this: void, container: ContainerContract): void {
        const collection = new RouteCollection();

        container.setSingleton<RouteCollectionContract>(CliRoutingServiceId.RouteCollectionContract, collection);

        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        if (app.getDebugMode()) {
            CliRoutingServiceProvider.publishData(container);

            return;
        }

        const data = container.getSingleton<CliRoutingData>(CliRoutingServiceId.CliRoutingData);

        collection.setFromData(data);
    }

    static publishData(this: void, container: ContainerContract): void {
        const collection = container.getSingleton<RouteCollectionContract>(CliRoutingServiceId.RouteCollectionContract);
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        for (const provider of app.getCliProviders()) {
            collection.add(...provider.getRoutes());
        }

        container.setSingleton(CliRoutingServiceId.CliRoutingData, collection.getData());
    }
}
