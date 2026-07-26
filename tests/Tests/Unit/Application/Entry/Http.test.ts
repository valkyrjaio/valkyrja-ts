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

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Config } from '../../../../../src/Valkyrja/Application/Data/Config.ts';
import { Http } from '../../../../../src/Valkyrja/Application/Entry/Http.ts';
import { ServerRequest } from '../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';
import { HttpServerServiceId } from '../../../../../src/Valkyrja/Http/Server/Constant/HttpServerServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';

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

afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(createServer).mockClear();
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

        Http.run(new Config() as unknown as HttpConfigContract, 8080);

        expect(createServer).toHaveBeenCalledTimes(1);

        // Drive the captured connection handler to cover the request callback.
        createServerHandler.current?.(nodeRequest, {} as ServerResponse);
        expect(requestHandler.run).toHaveBeenCalledTimes(1);
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
