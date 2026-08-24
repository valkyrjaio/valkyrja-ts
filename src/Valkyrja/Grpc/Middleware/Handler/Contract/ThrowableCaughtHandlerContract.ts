/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../Contract/ThrowableCaughtMiddlewareContract.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface ThrowableCaughtHandlerContract extends HandlerContract<ThrowableCaughtMiddlewareContract> {
    throwableCaught(
        call: ServiceCallContract,
        response: ServiceResponseContract,
        throwable: unknown,
    ): Promise<ServiceResponseContract>;
}
