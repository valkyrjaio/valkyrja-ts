import type { ServerResponse } from 'node:http';

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';

export interface RequestHandlerContract {
    handle(request: ServerRequestContract): ResponseContract;
    send(response: ResponseContract, nodeResponse: ServerResponse): this;
    terminate(request: ServerRequestContract, response: ResponseContract): void;
    run(request: ServerRequestContract, nodeResponse: ServerResponse): void;
}