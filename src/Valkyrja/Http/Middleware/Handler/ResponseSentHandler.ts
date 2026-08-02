/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
