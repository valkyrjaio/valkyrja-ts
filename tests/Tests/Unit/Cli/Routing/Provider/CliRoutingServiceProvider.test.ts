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
import { CliInteractionServiceId } from '../../../../../../src/Valkyrja/Cli/Interaction/Constant/CliInteractionServiceId.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { CliMiddlewareServiceId } from '../../../../../../src/Valkyrja/Cli/Middleware/Constant/CliMiddlewareServiceId.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Cli/Routing/Collection/RouteCollection.ts';
import { CliRoutingServiceId } from '../../../../../../src/Valkyrja/Cli/Routing/Constant/CliRoutingServiceId.ts';
import { CliRoutingData } from '../../../../../../src/Valkyrja/Cli/Routing/Data/CliRoutingData.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { Router } from '../../../../../../src/Valkyrja/Cli/Routing/Dispatcher/Router.ts';
import { CliRoutingServiceProvider } from '../../../../../../src/Valkyrja/Cli/Routing/Provider/CliRoutingServiceProvider.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const handler = (): OutputContract => new OutputFactory().createOutput();

function appWith(debugMode: boolean, routes: Route[] = []): ApplicationContract {
    return {
        getDebugMode: () => debugMode,
        getCliProviders: () => [{ getRoutes: () => routes }],
    } as unknown as ApplicationContract;
}

describe('CliRoutingServiceProvider', () => {
    it('publishes the router, collection, and data ids', () => {
        const publishers = new CliRoutingServiceProvider().publishers();

        expect(CliRoutingServiceId.RouterContract in publishers).toBe(true);
        expect(CliRoutingServiceId.RouteCollectionContract in publishers).toBe(true);
        expect(CliRoutingServiceId.CliRoutingData in publishers).toBe(true);
    });

    it('publishRouter wires a Router from its dependencies', () => {
        const container = new Container();
        container.setSingleton(CliRoutingServiceId.RouteCollectionContract, new RouteCollection());
        container.setSingleton(CliInteractionServiceId.OutputFactoryContract, new OutputFactory());
        for (const id of [
            CliMiddlewareServiceId.ThrowableCaughtHandlerContract,
            CliMiddlewareServiceId.RouteMatchedHandlerContract,
            CliMiddlewareServiceId.RouteNotMatchedHandlerContract,
            CliMiddlewareServiceId.RouteDispatchedHandlerContract,
            CliMiddlewareServiceId.ProcessExitingHandlerContract,
        ]) {
            container.setSingleton(id, {});
        }

        CliRoutingServiceProvider.publishRouter(container);

        expect(container.getSingleton(CliRoutingServiceId.RouterContract)).toBeInstanceOf(Router);
    });

    it('publishData collects routes from the application providers', () => {
        const container = new Container();
        container.setSingleton(CliRoutingServiceId.RouteCollectionContract, new RouteCollection());
        container.setSingleton(
            ApplicationServiceId.ApplicationContract,
            appWith(false, [new Route('build', 'd', handler)]),
        );

        CliRoutingServiceProvider.publishData(container);

        const data = container.getSingleton<CliRoutingData>(CliRoutingServiceId.CliRoutingData);
        expect(Object.keys(data.routes)).toContain('build');
    });

    it('publishRouteCollection rebuilds data in debug mode', () => {
        const container = new Container();
        container.setSingleton(
            ApplicationServiceId.ApplicationContract,
            appWith(true, [new Route('build', 'd', handler)]),
        );

        CliRoutingServiceProvider.publishRouteCollection(container);

        const collection = container.getSingleton<RouteCollection>(CliRoutingServiceId.RouteCollectionContract);
        expect(collection.has('build')).toBe(true);
    });

    it('publishRouteCollection loads precompiled data outside debug mode', () => {
        const container = new Container();
        container.setSingleton(ApplicationServiceId.ApplicationContract, appWith(false));
        container.setSingleton(
            CliRoutingServiceId.CliRoutingData,
            new CliRoutingData({ cached: () => new Route('cached', 'd', handler) }),
        );

        CliRoutingServiceProvider.publishRouteCollection(container);

        const collection = container.getSingleton<RouteCollection>(CliRoutingServiceId.RouteCollectionContract);
        expect(collection.has('cached')).toBe(true);
    });
});
