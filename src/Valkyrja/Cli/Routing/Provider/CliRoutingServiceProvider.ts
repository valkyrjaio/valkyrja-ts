/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationServiceId } from '../../../Application/Constant/ApplicationServiceId.ts';
import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import { CliInteractionServiceId } from '../../Interaction/Constant/CliInteractionServiceId.ts';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import { CliMiddlewareServiceId } from '../../Middleware/Constant/CliMiddlewareServiceId.ts';
import type { ProcessExitingHandlerContract } from '../../Middleware/Handler/Contract/ProcessExitingHandlerContract.ts';
import type { RouteDispatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.ts';
import type { RouteMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';
import type { RouteNotMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteNotMatchedHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.ts';
import { RouteCollection } from '../Collection/RouteCollection.ts';
import { AttributeRouteCollector } from '../Collector/AttributeRouteCollector.ts';
import type { RouteCollectorContract } from '../Collector/Contract/RouteCollectorContract.ts';
import { CliRoutingServiceId } from '../Constant/CliRoutingServiceId.ts';
import { CliRoutingData } from '../Data/CliRoutingData.ts';
import type { RouterContract } from '../Dispatcher/Contract/RouterContract.ts';
import { Router } from '../Dispatcher/Router.ts';

export class CliRoutingServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [CliRoutingServiceId.RouterContract]: CliRoutingServiceProvider.publishRouter,
            [CliRoutingServiceId.RouteCollectionContract]: CliRoutingServiceProvider.publishRouteCollection,
            [CliRoutingServiceId.RouteCollectorContract]: CliRoutingServiceProvider.publishAttributeRouteCollector,
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
                container.getSingleton<ProcessExitingHandlerContract>(
                    CliMiddlewareServiceId.ProcessExitingHandlerContract,
                ),
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

    static publishAttributeRouteCollector(this: void, container: ContainerContract): void {
        container.setSingleton<RouteCollectorContract>(
            CliRoutingServiceId.RouteCollectorContract,
            new AttributeRouteCollector(),
        );
    }

    static publishData(this: void, container: ContainerContract): void {
        const collection = container.getSingleton<RouteCollectionContract>(CliRoutingServiceId.RouteCollectionContract);
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        const controllers: Array<new (...args: unknown[]) => unknown> = [];

        for (const provider of app.getCliProviders()) {
            controllers.push(...provider.getControllerClasses());
            collection.add(...provider.getRoutes());
        }

        if (controllers.length > 0) {
            const collector = container.getSingleton<RouteCollectorContract>(
                CliRoutingServiceId.RouteCollectorContract,
            );

            collection.add(...collector.getRoutes(...controllers));
        }

        container.setSingleton(CliRoutingServiceId.CliRoutingData, collection.getData());
    }
}
