/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createServer } from 'node:http';
import type { IncomingMessage } from 'node:http';

import { App } from './Abstract/App.js';
import { HttpServerServiceId } from '../../Http/Server/Constant/HttpServerServiceId.js';
import { RequestFactory } from '../../Http/Message/Request/Factory/RequestFactory.js';

import type { HttpConfigContract } from '../Data/Contract/HttpConfigContract.js';
import type { ServerRequestContract } from '../../Http/Message/Request/Contract/ServerRequestContract.js';
import type { RequestHandlerContract } from '../../Http/Server/Handler/Contract/RequestHandlerContract.js';

export class Http extends App {
    static run(config: HttpConfigContract, port: number = 3000): void {
        const app = this.start(config);
        const container = app.getContainer();

        this.bootstrapThrowableHandler(app, container);

        const handler = container.getSingleton<RequestHandlerContract>(HttpServerServiceId.RequestHandlerContract);

        const server = createServer((req, res) => {
            const request = this.getRequest(req);
            handler.run(request, res);
        });

        server.listen(port);
    }

    static getRequest(nodeRequest: IncomingMessage): ServerRequestContract {
        return RequestFactory.fromNodeRequest(nodeRequest);
    }
}
