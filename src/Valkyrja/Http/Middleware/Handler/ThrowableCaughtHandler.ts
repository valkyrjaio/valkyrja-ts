/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../Contract/ThrowableCaughtMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { ThrowableCaughtHandlerContract } from './Contract/ThrowableCaughtHandlerContract.ts';

export class ThrowableCaughtHandler
    extends Handler<ThrowableCaughtMiddlewareContract>
    implements ThrowableCaughtHandlerContract
{
    throwableCaught(request: ServerRequestContract, response: ResponseContract, throwable: Error): ResponseContract {
        const next = this.next;

        return next !== null ? this.getMiddleware(next).throwableCaught(request, response, throwable, this) : response;
    }
}
