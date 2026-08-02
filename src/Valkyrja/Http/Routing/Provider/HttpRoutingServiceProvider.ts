/*
 * This file is part of the Valkyrja Framework package.
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
import { HttpMessageServiceId } from '../../Message/Constant/HttpMessageServiceId.ts';
import type { ResponseFactoryContract } from '../../Message/Response/Factory/Contract/ResponseFactoryContract.ts';
import { HttpMiddlewareServiceId } from '../../Middleware/Constant/HttpMiddlewareServiceId.ts';
import type { ResponseSentHandlerContract } from '../../Middleware/Handler/Contract/ResponseSentHandlerContract.ts';
import type { RouteDispatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteDispatchedHandlerContract.ts';
import type { RouteMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';
import type { RouteNotMatchedHandlerContract } from '../../Middleware/Handler/Contract/RouteNotMatchedHandlerContract.ts';
import type { SendingResponseHandlerContract } from '../../Middleware/Handler/Contract/SendingResponseHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.ts';
import { RouteCollection } from '../Collection/RouteCollection.ts';
import { AttributeRouteCollector } from '../Collector/AttributeRouteCollector.ts';
import type { RouteCollectorContract } from '../Collector/Contract/RouteCollectorContract.ts';
import type { DynamicRouteContract } from '../Data/Contract/DynamicRouteContract.ts';
import type { RouteContract } from '../Data/Contract/RouteContract.ts';
import { HttpRoutingServiceId } from '../Constant/HttpRoutingServiceId.ts';
import { HttpRoutingData } from '../Data/HttpRoutingData.ts';
import type { RouterContract } from '../Dispatcher/Contract/RouterContract.ts';
import { Router } from '../Dispatcher/Router.ts';
import type { RoutingResponseFactoryContract } from '../Factory/Contract/RoutingResponseFactoryContract.ts';
import { RoutingResponseFactory } from '../Factory/RoutingResponseFactory.ts';
import type { MatcherContract } from '../Matcher/Contract/MatcherContract.ts';
import { Matcher } from '../Matcher/Matcher.ts';
import type { ProcessorContract } from '../Processor/Contract/ProcessorContract.ts';
import { Processor } from '../Processor/Processor.ts';
import type { UrlContract } from '../Url/Contract/UrlContract.ts';
import { Url } from '../Url/Url.ts';

export class HttpRoutingServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [HttpRoutingServiceId.RouterContract]: HttpRoutingServiceProvider.publishRouter,
            [HttpRoutingServiceId.RouteCollectionContract]: HttpRoutingServiceProvider.publishRouteCollection,
            [HttpRoutingServiceId.MatcherContract]: HttpRoutingServiceProvider.publishMatcher,
            [HttpRoutingServiceId.UrlContract]: HttpRoutingServiceProvider.publishUrl,
            [HttpRoutingServiceId.RouteCollectorContract]: HttpRoutingServiceProvider.publishAttributeRouteCollector,
            [HttpRoutingServiceId.ProcessorContract]: HttpRoutingServiceProvider.publishProcessor,
            [HttpRoutingServiceId.RoutingResponseFactory]: HttpRoutingServiceProvider.publishResponseFactory,
            [HttpRoutingServiceId.HttpRoutingData]: HttpRoutingServiceProvider.publishData,
        };
    }

    static publishRouter(this: void, container: ContainerContract): void {
        container.setSingleton<RouterContract>(
            HttpRoutingServiceId.RouterContract,
            new Router(
                container,
                container.getSingleton<MatcherContract>(HttpRoutingServiceId.MatcherContract),
                container.getSingleton<ResponseFactoryContract>(HttpMessageServiceId.ResponseFactoryContract),
                container.getSingleton<ThrowableCaughtHandlerContract>(
                    HttpMiddlewareServiceId.ThrowableCaughtHandlerContract,
                ),
                container.getSingleton<RouteMatchedHandlerContract>(
                    HttpMiddlewareServiceId.RouteMatchedHandlerContract,
                ),
                container.getSingleton<RouteNotMatchedHandlerContract>(
                    HttpMiddlewareServiceId.RouteNotMatchedHandlerContract,
                ),
                container.getSingleton<RouteDispatchedHandlerContract>(
                    HttpMiddlewareServiceId.RouteDispatchedHandlerContract,
                ),
                container.getSingleton<SendingResponseHandlerContract>(
                    HttpMiddlewareServiceId.SendingResponseHandlerContract,
                ),
                container.getSingleton<ResponseSentHandlerContract>(
                    HttpMiddlewareServiceId.ResponseSentHandlerContract,
                ),
            ),
        );
    }

    static publishRouteCollection(this: void, container: ContainerContract): void {
        const collection = new RouteCollection();

        container.setSingleton<RouteCollectionContract>(HttpRoutingServiceId.RouteCollectionContract, collection);

        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);

        if (app.getDebugMode()) {
            HttpRoutingServiceProvider.publishData(container);

            return;
        }

        const data = container.getSingleton<HttpRoutingData>(HttpRoutingServiceId.HttpRoutingData);

        collection.setFromData(data);
    }

    static publishMatcher(this: void, container: ContainerContract): void {
        container.setSingleton<MatcherContract>(
            HttpRoutingServiceId.MatcherContract,
            new Matcher(container.getSingleton<RouteCollectionContract>(HttpRoutingServiceId.RouteCollectionContract)),
        );
    }

    static publishUrl(this: void, container: ContainerContract): void {
        container.setSingleton<UrlContract>(
            HttpRoutingServiceId.UrlContract,
            new Url(container.getSingleton<RouteCollectionContract>(HttpRoutingServiceId.RouteCollectionContract)),
        );
    }

    static publishProcessor(this: void, container: ContainerContract): void {
        container.setSingleton<ProcessorContract>(HttpRoutingServiceId.ProcessorContract, new Processor());
    }

    static publishAttributeRouteCollector(this: void, container: ContainerContract): void {
        container.setSingleton<RouteCollectorContract>(
            HttpRoutingServiceId.RouteCollectorContract,
            new AttributeRouteCollector(
                container.getSingleton<ProcessorContract>(HttpRoutingServiceId.ProcessorContract),
            ),
        );
    }

    static publishResponseFactory(this: void, container: ContainerContract): void {
        container.setSingleton<RoutingResponseFactoryContract>(
            HttpRoutingServiceId.RoutingResponseFactory,
            new RoutingResponseFactory(
                container.getSingleton<ResponseFactoryContract>(HttpMessageServiceId.ResponseFactoryContract),
                container.getSingleton<UrlContract>(HttpRoutingServiceId.UrlContract),
            ),
        );
    }

    static publishData(this: void, container: ContainerContract): void {
        const collection = container.getSingleton<RouteCollectionContract>(
            HttpRoutingServiceId.RouteCollectionContract,
        );
        const app = container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract);
        const processor = container.getSingleton<ProcessorContract>(HttpRoutingServiceId.ProcessorContract);

        const controllers: Array<new (...args: unknown[]) => unknown> = [];
        const routes: Array<RouteContract | DynamicRouteContract> = [];

        for (const provider of app.getHttpProviders()) {
            controllers.push(...provider.getControllerClasses());
            routes.push(...provider.getRoutes());
        }

        if (controllers.length > 0) {
            const collector = container.getSingleton<RouteCollectorContract>(
                HttpRoutingServiceId.RouteCollectorContract,
            );

            for (const route of collector.getRoutes(...controllers)) {
                collection.add(route);
            }
        }

        for (const route of routes) {
            collection.add(processor.route(route));
        }

        container.setSingleton(HttpRoutingServiceId.HttpRoutingData, collection.getData());
    }
}
