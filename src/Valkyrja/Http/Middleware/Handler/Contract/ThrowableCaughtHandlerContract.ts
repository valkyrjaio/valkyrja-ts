/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Contract/ThrowableCaughtMiddlewareContract.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface ThrowableCaughtHandlerContract extends HandlerContract<ThrowableCaughtMiddlewareContract> {
    throwableCaught(request: ServerRequestContract, response: ResponseContract, throwable: Error): ResponseContract;
}
