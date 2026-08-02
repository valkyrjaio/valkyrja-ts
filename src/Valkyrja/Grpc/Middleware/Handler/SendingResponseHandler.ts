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
import type { SendingResponseMiddlewareContract } from '../Contract/SendingResponseMiddlewareContract.ts';
import type { SendingResponseHandlerContract } from './Contract/SendingResponseHandlerContract.ts';

/**
 * Walks the `SendingResponse` chain. This stage always runs — including on the cancellation
 * fast-exit path — so it does not apply the cancellation short-circuit.
 */
export class SendingResponseHandler
    extends Handler<SendingResponseMiddlewareContract>
    implements SendingResponseHandlerContract
{
    async sendingResponse(
        call: ServiceCallContract,
        response: ServiceResponseContract,
    ): Promise<ServiceResponseContract> {
        const next = this.next;

        return next !== null ? this.getMiddleware(next).sendingResponse(call, response, this) : response;
    }
}
