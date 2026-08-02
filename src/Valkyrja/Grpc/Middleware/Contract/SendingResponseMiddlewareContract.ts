/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { SendingResponseHandlerContract } from '../Handler/Contract/SendingResponseHandlerContract.ts';

/** Middleware run before the adapter writes the response to the wire. Always runs. */
export interface SendingResponseMiddlewareContract {
    sendingResponse(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        handler: SendingResponseHandlerContract,
    ): Promise<ServiceResponseContract>;
}

export namespace SendingResponseMiddlewareContract {
    export function instanceOf(value: unknown): value is SendingResponseMiddlewareContract {
        return typeof value === 'object' && value !== null && 'sendingResponse' in value;
    }
}
