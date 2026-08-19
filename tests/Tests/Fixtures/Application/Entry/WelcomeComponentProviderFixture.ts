/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { HtmlResponse } from '../../../../../src/Valkyrja/Http/Message/Response/HtmlResponse.ts';
import { Route } from '../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../../../../../src/Valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';
import type { ServiceProviderContract } from '../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { ListenerProviderContract } from '../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';
import type { CliRouteProviderContract } from '../../../../../src/Valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
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
 * Registers the welcome route provider so a booted app serves `GET /` without generated routing data.
 */
export class WelcomeComponentProviderFixture implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [];
    }

    getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [];
    }

    getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [new WelcomeHttpRouteProviderFixture()];
    }
}
