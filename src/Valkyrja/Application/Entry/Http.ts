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

import { App } from './Abstract/App.ts';
import { HttpServerServiceId } from '../../Http/Server/Constant/HttpServerServiceId.ts';
import { RequestFactory } from '../../Http/Message/Request/Factory/RequestFactory.ts';

import type { HttpConfigContract } from '../Data/Contract/HttpConfigContract.ts';
import type { ServerRequestContract } from '../../Http/Message/Request/Contract/ServerRequestContract.ts';
import type { RequestHandlerContract } from '../../Http/Server/Handler/Contract/RequestHandlerContract.ts';

export class Http extends App {
    static run(config: HttpConfigContract, port: number = 3000): void {
        const server = createServer((req, res) => {
            this.handle(config, req, res);
        });

        server.listen(port);
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
}
