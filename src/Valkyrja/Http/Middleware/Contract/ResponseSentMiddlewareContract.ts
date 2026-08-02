/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { ResponseSentHandlerContract } from '../Handler/Contract/ResponseSentHandlerContract.ts';

export interface ResponseSentMiddlewareContract {
    responseSent(
        request: ServerRequestContract,
        response: ResponseContract,
        handler: ResponseSentHandlerContract,
    ): void;
}
