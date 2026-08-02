/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { RequestReceivedMiddlewareContract } from '../Contract/RequestReceivedMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { RequestReceivedHandlerContract } from './Contract/RequestReceivedHandlerContract.ts';

export class RequestReceivedHandler
    extends Handler<RequestReceivedMiddlewareContract>
    implements RequestReceivedHandlerContract
{
    requestReceived(request: ServerRequestContract): ResponseContract | ServerRequestContract {
        const next = this.next;

        return next !== null ? this.getMiddleware(next).requestReceived(request, this) : request;
    }
}
