/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { ResponseSentMiddlewareContract } from '../Contract/ResponseSentMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { ResponseSentHandlerContract } from './Contract/ResponseSentHandlerContract.ts';

export class ResponseSentHandler
    extends Handler<ResponseSentMiddlewareContract>
    implements ResponseSentHandlerContract
{
    responseSent(request: ServerRequestContract, response: ResponseContract): void {
        const next = this.next;

        if (next !== null) {
            this.getMiddleware(next).responseSent(request, response, this);
        }
    }
}
