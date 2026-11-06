/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Handler } from './Abstract/Handler.ts';

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ResponseSentMiddlewareContract } from '../Contract/ResponseSentMiddlewareContract.ts';
import type { ResponseSentHandlerContract } from './Contract/ResponseSentHandlerContract.ts';

export class ResponseSentHandler
    extends Handler<ResponseSentMiddlewareContract>
    implements ResponseSentHandlerContract
{
    async responseSent(call: ServiceCallContract, response: ServiceResponseContract): Promise<void> {
        const next = this.next;

        if (next !== null) {
            await this.getMiddleware(next).responseSent(call, response, this);
        }
    }
}
