/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.ts';

/** Middleware run when an earlier stage throws, converting the throwable into a response. */
export interface ThrowableCaughtMiddlewareContract {
    throwableCaught(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        throwable: unknown,
        handler: ThrowableCaughtHandlerContract,
    ): Promise<ServiceResponseContract>;
}

export namespace ThrowableCaughtMiddlewareContract {
    export function instanceOf(value: unknown): value is ThrowableCaughtMiddlewareContract {
        return typeof value === 'object' && value !== null && 'throwableCaught' in value;
    }
}
