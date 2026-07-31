/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/Abstract/ComponentProvider.ts';
import { HtmlResponse } from '../../../../../src/Valkyrja/Http/Message/Response/HtmlResponse.ts';
import { Route } from '../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { HttpRouteProviderContract } from '../../../../../src/Valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';
import type { DynamicRouteContract } from '../../../../../src/Valkyrja/Http/Routing/Data/Contract/DynamicRouteContract.ts';
import type { RouteContract } from '../../../../../src/Valkyrja/Http/Routing/Data/Contract/RouteContract.ts';

/**
 * A route provider that serves the welcome view for `GET /`.
 */
class WelcomeHttpRouteProviderFixture implements HttpRouteProviderContract {
    getControllerClasses(): Array<new (...args: unknown[]) => unknown> {
        return [];
    }

    getRoutes(): Array<RouteContract | DynamicRouteContract> {
        return [new Route('/', 'welcome', (): HtmlResponse => new HtmlResponse('<h1>Welcome!</h1>'))];
    }
}

/**
 * A component provider that registers the welcome route provider with the
 * application, so a booted app can serve `GET /` end to end without depending on
 * generated routing data — reused by the HTTP and worker-HTTP entry tests.
 */
export class WelcomeComponentProviderFixture extends ComponentProvider {
    override getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [new WelcomeHttpRouteProviderFixture()];
    }
}
