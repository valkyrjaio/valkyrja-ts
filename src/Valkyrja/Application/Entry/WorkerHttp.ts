/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';

import { ChildApplication } from '../Kernel/ChildApplication.ts';
import { ChildContainer } from '../../Container/Manager/ChildContainer.ts';
import { ApplicationServiceId } from '../Constant/ApplicationServiceId.ts';
import { ContainerServiceId } from '../../Container/Constant/ContainerServiceId.ts';
import { HttpServerServiceId } from '../../Http/Server/Constant/HttpServerServiceId.ts';
import { HttpRoutingServiceId } from '../../Http/Routing/Constant/HttpRoutingServiceId.ts';
import { RequestFactory } from '../../Http/Message/Request/Factory/RequestFactory.ts';
import { App } from './Abstract/App.ts';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '../../Container/Manager/Contract/ContainerContract.ts';
import type { ContainerData } from '../../Container/Data/ContainerData.ts';
import type { HttpConfigContract } from '../Data/Contract/HttpConfigContract.ts';
import type { ServerRequestContract } from '../../Http/Message/Request/Contract/ServerRequestContract.ts';
import type { RequestHandlerContract } from '../../Http/Server/Handler/Contract/RequestHandlerContract.ts';
import type { RouteCollectionContract } from '../../Http/Routing/Collection/Contract/RouteCollectionContract.ts';

export class WorkerHttp extends App {
    static run(config: HttpConfigContract, port: number = 3000): void {
        const app = this.bootstrap(config);
        const data = app.getContainer().getData();

        const server = this.createServer((req, res) => {
            this.handle(app, data, req, res);
        });

        this.listen(server, port);
    }

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

    /**
     * Create the native HTTP server.
     *
     * Overridable runtime seam wrapping Node's socket-creating `createServer`, so
     * tests can substitute a double without opening a real socket. Ignored for
     * coverage because it is irreducible runtime I/O that only runs against a live
     * server.
     */
    /* v8 ignore start */
    static createServer(handler: (request: IncomingMessage, response: ServerResponse) => void): Server {
        return createServer(handler);
    }
    /* v8 ignore stop */

    /**
     * Bind the server to the given port.
     *
     * Overridable runtime seam wrapping Node's socket-binding `listen`, so tests
     * can substitute a double without binding a real port. Ignored for coverage
     * because it is irreducible runtime I/O that only runs against a live server.
     */
    /* v8 ignore start */
    static listen(server: Server, port: number): void {
        server.listen(port);
    }
    /* v8 ignore stop */
}
