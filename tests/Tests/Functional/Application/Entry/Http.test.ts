/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { IncomingMessage, Server, ServerResponse } from 'node:http';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApplicationServiceId } from '../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { HttpConfig } from '../../../../../src/Valkyrja/Application/Data/HttpConfig.ts';
import { HttpApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/HttpApplicationComponentProvider.ts';
import { Directory } from '../../../../../src/Valkyrja/Application/Directory/Directory.ts';
import { Http } from '../../../../../src/Valkyrja/Application/Entry/Http.ts';
import { ContainerServiceId } from '../../../../../src/Valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { StatusCode } from '../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { RequestMethod } from '../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { ServerRequest } from '../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';
import { UriFactory } from '../../../../../src/Valkyrja/Http/Message/Uri/Factory/UriFactory.ts';
import { HttpServerServiceId } from '../../../../../src/Valkyrja/Http/Server/Constant/HttpServerServiceId.ts';
import { NodeServerRequestFixture } from '../../../Fixtures/Application/Entry/NodeServerRequestFixture.ts';
import { NodeServerResponseFixture } from '../../../Fixtures/Application/Entry/NodeServerResponseFixture.ts';
import { WelcomeComponentProviderFixture } from '../../../Fixtures/Application/Entry/WelcomeComponentProviderFixture.ts';

import type { RequestHandlerContract } from '../../../../../src/Valkyrja/Http/Server/Handler/Contract/RequestHandlerContract.ts';

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

describe('Http (functional)', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

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

    it('serves a live GET / end to end through run(), writing the response back', () => {
        Http.directory(Directory.basePath);

        // Double only the runtime seams: capture the connection handler run()
        // registers and swallow the socket bind, so no real port is opened.
        let connectionHandler: ((request: IncomingMessage, response: ServerResponse) => void) | undefined;
        vi.spyOn(Http, 'createServer').mockImplementation((handler) => {
            connectionHandler = handler;

            return {} as Server;
        });
        vi.spyOn(Http, 'listen').mockImplementation(() => {});

        Http.run(welcomeConfig());

        expect(connectionHandler).toBeDefined();

        // Drive the captured handler with a real request against a capturing
        // response — exercising the full per-request path a live socket would.
        const nodeResponse = new NodeServerResponseFixture();
        connectionHandler?.(NodeServerRequestFixture.make('/', 'GET'), nodeResponse.asServerResponse());

        expect(nodeResponse.ended).toBe(true);
        expect(nodeResponse.statusCode).toBe(StatusCode.OK);
        expect(nodeResponse.body).toContain('Welcome!');
    });
});
