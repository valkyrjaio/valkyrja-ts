import type { IncomingMessage, ServerResponse } from 'node:http';

import { ChildApplication } from '../../Kernel/ChildApplication.js';
import { ChildContainer } from '../../../Container/Manager/ChildContainer.js';
import { ApplicationServiceId } from '../../Constant/ApplicationServiceId.js';
import { ContainerServiceId } from '../../../Container/Constant/ContainerServiceId.js';
import { HttpServerServiceId } from '../../../Http/Server/Constant/HttpServerServiceId.js';
import { HttpRoutingServiceId } from '../../../Http/Routing/Constant/HttpRoutingServiceId.js';
import { RequestFactory } from '../../../Http/Message/Request/Factory/RequestFactory.js';
import { App } from './App.js';

import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ContainerData } from '../../../Container/Data/ContainerData.js';
import type { HttpConfigContract } from '../../Data/Contract/HttpConfigContract.js';
import type { ServerRequestContract } from '../../../Http/Message/Request/Contract/ServerRequestContract.js';
import type { RequestHandlerContract } from '../../../Http/Server/Handler/Contract/RequestHandlerContract.js';
import type { RouteCollectionContract } from '../../../Http/Routing/Collection/Contract/RouteCollectionContract.js';

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
