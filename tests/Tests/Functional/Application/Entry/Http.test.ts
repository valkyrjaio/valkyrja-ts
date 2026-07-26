/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { HttpConfig } from '../../../../../src/Valkyrja/Application/Data/HttpConfig.ts';
import { HttpApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/HttpApplicationComponentProvider.ts';
import { Directory } from '../../../../../src/Valkyrja/Application/Directory/Directory.ts';
import { Http } from '../../../../../src/Valkyrja/Application/Entry/Http.ts';
import { ContainerServiceId } from '../../../../../src/Valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { StatusCode } from '../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { RequestMethod } from '../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { HtmlResponse } from '../../../../../src/Valkyrja/Http/Message/Response/HtmlResponse.ts';
import { ServerRequest } from '../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';
import { UriFactory } from '../../../../../src/Valkyrja/Http/Message/Uri/Factory/UriFactory.ts';
import { HttpServerServiceId } from '../../../../../src/Valkyrja/Http/Server/Constant/HttpServerServiceId.ts';
import { Route } from '../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../../../../../src/Valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';
import type { ServiceProviderContract } from '../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { ListenerProviderContract } from '../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';
import type { CliRouteProviderContract } from '../../../../../src/Valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { HttpRouteProviderContract } from '../../../../../src/Valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';
import type { DynamicRouteContract } from '../../../../../src/Valkyrja/Http/Routing/Data/Contract/DynamicRouteContract.ts';
import type { RouteContract } from '../../../../../src/Valkyrja/Http/Routing/Data/Contract/RouteContract.ts';
import type { RequestHandlerContract } from '../../../../../src/Valkyrja/Http/Server/Handler/Contract/RequestHandlerContract.ts';

// A route provider that serves the welcome view for `GET /`.
class WelcomeHttpRouteProvider implements HttpRouteProviderContract {
    getRoutes(): Array<RouteContract | DynamicRouteContract> {
        return [new Route('/', 'welcome', (): HtmlResponse => new HtmlResponse('<h1>Welcome!</h1>'))];
    }
}

// A component provider that registers the welcome route provider with the application.
class WelcomeComponentProvider implements ComponentProviderContract {
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
        return [new WelcomeHttpRouteProvider()];
    }
}

// A debug config discovers routes at runtime, so it functions against an empty data cache.
const welcomeConfig = (): HttpConfig =>
    new HttpConfig(
        'App',
        process.cwd(),
        '1.0.0',
        'production',
        true,
        'UTC',
        'some_secret_app_key',
        'App/Provider/Data',
        'App/Provider/Data',
        [new HttpApplicationComponentProvider(), new WelcomeComponentProvider()],
    );

describe('Http (functional)', () => {
    it('boots an HTTP application and registers the core services', () => {
        Http.directory(Directory.basePath);

        const app = Http.app(new HttpConfig());
        const container = app.getContainer();

        expect(container).toBeInstanceOf(Container);
        expect(container.has(ApplicationServiceId.HttpConfigContract)).toBe(true);
        expect(container.has(ApplicationServiceId.CliConfigContract)).toBe(false);
        expect(container.has(ContainerServiceId.Contract)).toBe(true);
        expect(container.has(ApplicationServiceId.ApplicationContract)).toBe(true);
    });

    it('dispatches a GET / request through the request handler to the welcome view', () => {
        Http.directory(Directory.basePath);

        const app = Http.app(welcomeConfig());
        const container = app.getContainer();

        const handler = container.getSingleton<RequestHandlerContract>(HttpServerServiceId.RequestHandlerContract);
        const request = new ServerRequest(UriFactory.fromString('http://localhost/'), RequestMethod.GET);

        const response = handler.handle(request);

        expect(response.getStatusCode()).toBe(StatusCode.OK);

        const body = response.getBody();
        body.rewind();

        expect(body.getContents()).toContain('Welcome!');
    });
});
