/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
