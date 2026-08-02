/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { IncomingMessage, Server, ServerResponse } from 'node:http';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Config } from '../../../../../src/Valkyrja/Application/Data/Config.ts';
import { Http } from '../../../../../src/Valkyrja/Application/Entry/Http.ts';
import { ServerRequest } from '../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';
import { HttpServerServiceId } from '../../../../../src/Valkyrja/Http/Server/Constant/HttpServerServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { NodeServerRequestFixture } from '../../../Fixtures/Application/Entry/NodeServerRequestFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { HttpConfigContract } from '../../../../../src/Valkyrja/Application/Data/Contract/HttpConfigContract.ts';

const nodeRequest = NodeServerRequestFixture.make();

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Http', () => {
    it('getRequest builds a server request from a node request', () => {
        expect(Http.getRequest(nodeRequest)).toBeInstanceOf(ServerRequest);
    });

    it('run starts a server that handles incoming requests', () => {
        const requestHandler = { run: vi.fn() };
        const container = new Container();
        container.setSingleton(HttpServerServiceId.RequestHandlerContract, requestHandler);
        const app = { getContainer: () => container, getDebugMode: () => false } as unknown as ApplicationContract;
        vi.spyOn(Http, 'start').mockReturnValue(app);

        // Double the runtime seams so no real socket is created or bound.
        let capturedHandler: ((request: IncomingMessage, response: ServerResponse) => void) | undefined;
        const server = {} as Server;
        const createServer = vi.spyOn(Http, 'createServer').mockImplementation((handler) => {
            capturedHandler = handler;

            return server;
        });
        const listen = vi.spyOn(Http, 'listen').mockImplementation(() => {});

        Http.run(new Config() as unknown as HttpConfigContract, 8080);

        expect(createServer).toHaveBeenCalledTimes(1);
        expect(listen).toHaveBeenCalledWith(server, 8080);

        // Drive the captured connection handler to cover the request callback.
        capturedHandler?.(nodeRequest, {} as ServerResponse);
        expect(requestHandler.run).toHaveBeenCalledTimes(1);
    });

    it('run defaults to port 3000 when none is given', () => {
        const container = new Container();
        container.setSingleton(HttpServerServiceId.RequestHandlerContract, { run: vi.fn() });
        const app = { getContainer: () => container, getDebugMode: () => false } as unknown as ApplicationContract;
        vi.spyOn(Http, 'start').mockReturnValue(app);
        vi.spyOn(Http, 'createServer').mockReturnValue({} as Server);
        const listen = vi.spyOn(Http, 'listen').mockImplementation(() => {});

        Http.run(new Config() as unknown as HttpConfigContract);

        expect(listen).toHaveBeenCalledWith(expect.anything(), 3000);
    });

    it('handle bootstraps a fresh application and dispatches a single request', () => {
        const requestHandler = { run: vi.fn() };
        const container = new Container();
        container.setSingleton(HttpServerServiceId.RequestHandlerContract, requestHandler);
        const app = { getContainer: () => container, getDebugMode: () => false } as unknown as ApplicationContract;
        vi.spyOn(Http, 'start').mockReturnValue(app);

        Http.handle(new Config() as unknown as HttpConfigContract, nodeRequest, {} as ServerResponse);

        expect(requestHandler.run).toHaveBeenCalledTimes(1);
    });
});
