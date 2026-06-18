/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';

import { ChildApplication } from '../../Kernel/ChildApplication.ts';
import { ChildContainer } from '../../../Container/Manager/ChildContainer.ts';
import { ApplicationServiceId } from '../../Constant/ApplicationServiceId.ts';
import { ContainerServiceId } from '../../../Container/Constant/ContainerServiceId.ts';
import { HttpServerServiceId } from '../../../Http/Server/Constant/HttpServerServiceId.ts';
import { HttpRoutingServiceId } from '../../../Http/Routing/Constant/HttpRoutingServiceId.ts';
import { RequestFactory } from '../../../Http/Message/Request/Factory/RequestFactory.ts';
import { App } from './App.ts';

import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ContainerData } from '../../../Container/Data/ContainerData.ts';
import type { HttpConfigContract } from '../../Data/Contract/HttpConfigContract.ts';
import type { ServerRequestContract } from '../../../Http/Message/Request/Contract/ServerRequestContract.ts';
import type { RequestHandlerContract } from '../../../Http/Server/Handler/Contract/RequestHandlerContract.ts';
import type { RouteCollectionContract } from '../../../Http/Routing/Collection/Contract/RouteCollectionContract.ts';

export abstract class WorkerHttp extends App {
    static bootstrap(config: HttpConfigContract): ApplicationContract {
        const app = this.start(config);
        const container = app.getContainer();

        this.bootstrapThrowableHandler(app, container);
        this.bootstrapParentServices(app);

        return app;
    }

    static handle(
        app: ApplicationContract,
        data: ContainerData,
        nodeRequest: IncomingMessage,
        nodeResponse: ServerResponse,
    ): void {
        const request = this.getRequest(nodeRequest);
        const childContainer = this.getChildContainer(app, data);
        const childApp = this.getChildApplication(app, childContainer);

        this.bootstrapChildContainer(childApp, childContainer);
        this.handleRequest(childContainer, request, nodeResponse);
    }

    static getChildApplication(app: ApplicationContract, container: ContainerContract): ApplicationContract {
        return new ChildApplication(app, container);
    }

    static getChildContainer(app: ApplicationContract, data: ContainerData): ContainerContract {
        return new ChildContainer(app.getContainer(), data);
    }

    static bootstrapChildContainer(app: ApplicationContract, container: ContainerContract): void {
        container.setSingleton(ApplicationServiceId.ApplicationContract, app);
        container.setSingleton(ContainerServiceId.Contract, container);
    }

    static handleRequest(
        container: ContainerContract,
        request: ServerRequestContract,
        nodeResponse: ServerResponse,
    ): void {
        const handler = container.getSingleton<RequestHandlerContract>(HttpServerServiceId.RequestHandlerContract);
        handler.run(request, nodeResponse);
    }

    static getRequest(nodeRequest: IncomingMessage): ServerRequestContract {
        return RequestFactory.fromNodeRequest(nodeRequest);
    }

    static bootstrapParentServices(app: ApplicationContract): void {
        app.getContainer().getSingleton<RouteCollectionContract>(HttpRoutingServiceId.RouteCollectionContract);
    }
}
