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

import { ApplicationServiceId } from '../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { HttpConfig } from '../../../../../src/Valkyrja/Application/Data/HttpConfig.ts';
import { HttpApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/HttpApplicationComponentProvider.ts';
import { Directory } from '../../../../../src/Valkyrja/Application/Directory/Directory.ts';
import { WorkerHttp } from '../../../../../src/Valkyrja/Application/Entry/WorkerHttp.ts';
import { ContainerServiceId } from '../../../../../src/Valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { StatusCode } from '../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { NodeServerRequestFixture } from '../../../Fixtures/Application/Entry/NodeServerRequestFixture.ts';
import { NodeServerResponseFixture } from '../../../Fixtures/Application/Entry/NodeServerResponseFixture.ts';
import { WelcomeComponentProviderFixture } from '../../../Fixtures/Application/Entry/WelcomeComponentProviderFixture.ts';

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
        [new HttpApplicationComponentProvider(), new WelcomeComponentProviderFixture()],
    );

describe('WorkerHttp (functional)', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('bootstraps a worker application once and registers the core services', () => {
        WorkerHttp.directory(Directory.basePath);

        const app = WorkerHttp.bootstrap(welcomeConfig());
        const container = app.getContainer();

        expect(container).toBeInstanceOf(Container);
        expect(container.has(ApplicationServiceId.HttpConfigContract)).toBe(true);
        expect(container.has(ApplicationServiceId.CliConfigContract)).toBe(false);
        expect(container.has(ContainerServiceId.Contract)).toBe(true);
        expect(container.has(ApplicationServiceId.ApplicationContract)).toBe(true);
    });

    it('serves a live GET / end to end through run(), writing the response back', () => {
        WorkerHttp.directory(Directory.basePath);

        // Double only the runtime seams: capture the connection handler run()
        // registers and swallow the socket bind, so no real port is opened.
        let connectionHandler: ((request: IncomingMessage, response: ServerResponse) => void) | undefined;
        vi.spyOn(WorkerHttp, 'createServer').mockImplementation((handler) => {
            connectionHandler = handler;

            return {} as Server;
        });
        vi.spyOn(WorkerHttp, 'listen').mockImplementation(() => {});

        WorkerHttp.run(welcomeConfig());

        expect(connectionHandler).toBeDefined();

        // Drive the captured handler with a real request against a capturing
        // response — exercising the full per-request child scope a live socket would.
        const nodeResponse = new NodeServerResponseFixture();
        connectionHandler?.(NodeServerRequestFixture.make('/', 'GET'), nodeResponse.asServerResponse());

        expect(nodeResponse.ended).toBe(true);
        expect(nodeResponse.statusCode).toBe(StatusCode.OK);
        expect(nodeResponse.body).toContain('Welcome!');
    });

    it('bootstraps once and serves each request from an isolated child scope', () => {
        WorkerHttp.directory(Directory.basePath);

        const bootstrapSpy = vi.spyOn(WorkerHttp, 'bootstrap');
        const childContainers = vi.spyOn(WorkerHttp, 'getChildContainer');

        let connectionHandler: ((request: IncomingMessage, response: ServerResponse) => void) | undefined;
        vi.spyOn(WorkerHttp, 'createServer').mockImplementation((handler) => {
            connectionHandler = handler;

            return {} as Server;
        });
        vi.spyOn(WorkerHttp, 'listen').mockImplementation(() => {});

        WorkerHttp.run(welcomeConfig());

        // Two live requests through the same booted worker.
        const first = new NodeServerResponseFixture();
        const second = new NodeServerResponseFixture();
        connectionHandler?.(NodeServerRequestFixture.make('/', 'GET'), first.asServerResponse());
        connectionHandler?.(NodeServerRequestFixture.make('/', 'GET'), second.asServerResponse());

        // The application is bootstrapped exactly once, but each request gets its
        // own child container — no state leaks between sibling requests.
        expect(bootstrapSpy).toHaveBeenCalledTimes(1);
        expect(childContainers).toHaveBeenCalledTimes(2);
        expect(childContainers.mock.results[0]?.value).not.toBe(childContainers.mock.results[1]?.value);
        expect(first.body).toContain('Welcome!');
        expect(second.body).toContain('Welcome!');
    });
});
