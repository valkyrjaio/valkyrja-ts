/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { SendingResponseHandlerContract } from '../Handler/Contract/SendingResponseHandlerContract.ts';

export interface SendingResponseMiddlewareContract {
    sendingResponse(
        request: ServerRequestContract,
        response: ResponseContract,
        handler: SendingResponseHandlerContract,
    ): ResponseContract;
}
