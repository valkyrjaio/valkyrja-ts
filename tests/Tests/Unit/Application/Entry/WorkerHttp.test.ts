/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createServer } from 'node:http';

import type { IncomingMessage, ServerResponse } from 'node:http';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApplicationServiceId } from '../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Config } from '../../../../../src/Valkyrja/Application/Data/Config.ts';
import { WorkerHttp } from '../../../../../src/Valkyrja/Application/Entry/WorkerHttp.ts';
import { ChildApplication } from '../../../../../src/Valkyrja/Application/Kernel/ChildApplication.ts';
import { Valkyrja } from '../../../../../src/Valkyrja/Application/Kernel/Valkyrja.ts';
import { ContainerServiceId } from '../../../../../src/Valkyrja/Container/Constant/ContainerServiceId.ts';
import { ContainerData } from '../../../../../src/Valkyrja/Container/Data/ContainerData.ts';
import { ChildContainer } from '../../../../../src/Valkyrja/Container/Manager/ChildContainer.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { ServerRequest } from '../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';
import { RouteCollection } from '../../../../../src/Valkyrja/Http/Routing/Collection/RouteCollection.ts';
import { HttpRoutingServiceId } from '../../../../../src/Valkyrja/Http/Routing/Constant/HttpRoutingServiceId.ts';
import { HttpServerServiceId } from '../../../../../src/Valkyrja/Http/Server/Constant/HttpServerServiceId.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { HttpConfigContract } from '../../../../../src/Valkyrja/Application/Data/Contract/HttpConfigContract.ts';

vi.mock('node:http', () => {
    const listen = vi.fn();

    return {
        createServer: vi.fn((handler: (req: IncomingMessage, res: ServerResponse) => void) => {
            (createServerHandler as { current?: typeof handler }).current = handler;

            return { listen };
        }),
    };
});

const createServerHandler: { current?: (req: IncomingMessage, res: ServerResponse) => void } = {};

const nodeRequest = {
    headers: {},
    url: '/',
    method: 'GET',
    httpVersion: '1.1',
    socket: {},
} as unknown as IncomingMessage;
const nodeResponse = {} as ServerResponse;

describe('WorkerHttp', () => {
    let parentContainer: Container;
    let app: Valkyrja;
    let requestHandler: { run: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        parentContainer = new Container();
        app = new Valkyrja(parentContainer, new Config());
        requestHandler = { run: vi.fn() };
        parentContainer.setSingleton(HttpServerServiceId.RequestHandlerContract, requestHandler);
        parentContainer.setSingleton(HttpRoutingServiceId.RouteCollectionContract, new RouteCollection());
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.mocked(createServer).mockClear();
    });

    it('run bootstraps once and starts a server that dispatches to child scopes', () => {
        const bootstrapped = {
            getContainer: () => ({ getData: () => new ContainerData() }),
        } as unknown as ApplicationContract;
        vi.spyOn(WorkerHttp, 'bootstrap').mockReturnValue(bootstrapped);
        const handleSpy = vi.spyOn(WorkerHttp, 'handle').mockImplementation(() => {});

        WorkerHttp.run(new Config() as unknown as HttpConfigContract, 8080);

        expect(createServer).toHaveBeenCalledTimes(1);

        // Drive the captured connection handler to cover the request callback.
        createServerHandler.current?.(nodeRequest, nodeResponse);
        expect(handleSpy).toHaveBeenCalledTimes(1);
    });

    it('getChildContainer creates a ChildContainer from the parent container', () => {
        expect(WorkerHttp.getChildContainer(app, new ContainerData())).toBeInstanceOf(ChildContainer);
    });

    it('getChildApplication creates a ChildApplication', () => {
        expect(WorkerHttp.getChildApplication(app, new Container())).toBeInstanceOf(ChildApplication);
    });

    it('bootstrapChildContainer registers the application and container singletons', () => {
        const childContainer = new ChildContainer(parentContainer, new ContainerData());
        const childApp = WorkerHttp.getChildApplication(app, childContainer);

        WorkerHttp.bootstrapChildContainer(childApp, childContainer);

        expect(childContainer.getSingleton(ApplicationServiceId.ApplicationContract)).toBe(childApp);
        expect(childContainer.getSingleton(ContainerServiceId.Contract)).toBe(childContainer);
    });

    it('getRequest builds a server request from a node request', () => {
        expect(WorkerHttp.getRequest(nodeRequest)).toBeInstanceOf(ServerRequest);
    });

    it('handleRequest runs the request handler from the container', () => {
        const childContainer = new ChildContainer(parentContainer, new ContainerData());

        WorkerHttp.handleRequest(childContainer, WorkerHttp.getRequest(nodeRequest), nodeResponse);

        expect(requestHandler.run).toHaveBeenCalledTimes(1);
    });

    it('handle builds the child scope and dispatches the request', () => {
        WorkerHttp.handle(app, new ContainerData(), nodeRequest, nodeResponse);

        expect(requestHandler.run).toHaveBeenCalledTimes(1);
    });

    it('bootstrapParentServices warms the route collection', () => {
        expect(() => WorkerHttp.bootstrapParentServices(app)).not.toThrow();
    });

    it('bootstrap starts the application and warms parent services', () => {
        vi.spyOn(WorkerHttp, 'start').mockReturnValue(app);

        const result = WorkerHttp.bootstrap(new Config() as unknown as HttpConfigContract);

        expect(result).toBe(app as unknown as ApplicationContract);
    });
});
