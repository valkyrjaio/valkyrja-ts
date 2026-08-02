/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerResponse } from 'node:http';

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';

export interface RequestHandlerContract {
    handle(request: ServerRequestContract): ResponseContract;
    send(response: ResponseContract, nodeResponse: ServerResponse): this;
    terminate(request: ServerRequestContract, response: ResponseContract): void;
    run(request: ServerRequestContract, nodeResponse: ServerResponse): void;
}
