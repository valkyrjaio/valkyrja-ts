/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { SendingResponseMiddlewareContract } from '../Contract/SendingResponseMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { SendingResponseHandlerContract } from './Contract/SendingResponseHandlerContract.ts';

export class SendingResponseHandler
    extends Handler<SendingResponseMiddlewareContract>
    implements SendingResponseHandlerContract
{
    sendingResponse(request: ServerRequestContract, response: ResponseContract): ResponseContract {
        const next = this.next;

        return next !== null ? this.getMiddleware(next).sendingResponse(request, response, this) : response;
    }
}
