/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ResponseSentHandlerContract } from '../Handler/Contract/ResponseSentHandlerContract.ts';

/** Middleware run after the response has been fully written to the wire. */
export interface ResponseSentMiddlewareContract {
    responseSent(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        handler: ResponseSentHandlerContract,
    ): Promise<void>;
}

export namespace ResponseSentMiddlewareContract {
    export function instanceOf(value: unknown): value is ResponseSentMiddlewareContract {
        return typeof value === 'object' && value !== null && 'responseSent' in value;
    }
}
