/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';

import { App } from './Abstract/App.ts';
import { HttpServerServiceId } from '../../Http/Server/Constant/HttpServerServiceId.ts';
import { RequestFactory } from '../../Http/Message/Request/Factory/RequestFactory.ts';

import type { HttpConfigContract } from '../Data/Contract/HttpConfigContract.ts';
import type { ServerRequestContract } from '../../Http/Message/Request/Contract/ServerRequestContract.ts';
import type { RequestHandlerContract } from '../../Http/Server/Handler/Contract/RequestHandlerContract.ts';

export class Http extends App {
    static run(config: HttpConfigContract, port: number = 3000): void {
        const server = this.createServer((req, res) => {
            this.handle(config, req, res);
        });

        this.listen(server, port);
    }

    static handle(config: HttpConfigContract, nodeRequest: IncomingMessage, nodeResponse: ServerResponse): void {
        const app = this.start(config);
        const container = app.getContainer();

        this.bootstrapThrowableHandler(app, container);

        const handler = container.getSingleton<RequestHandlerContract>(HttpServerServiceId.RequestHandlerContract);

        handler.run(this.getRequest(nodeRequest), nodeResponse);
    }

    static getRequest(nodeRequest: IncomingMessage): ServerRequestContract {
        return RequestFactory.fromNodeRequest(nodeRequest);
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
