/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CallReceivedResult } from '../../../../../src/Valkyrja/Grpc/Middleware/Data/CallReceivedResult.ts';
import { ServiceResponse } from '../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Status } from '../../../../../src/Valkyrja/Grpc/Message/Status/Status.ts';

import type { ServiceCallContract } from '../../../../../src/Valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { CallReceivedMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/CallReceivedMiddlewareContract.ts';

/** Returns a response without calling the handler, short-circuiting the rest of the chain. */
export class ShortCircuitCallReceivedMiddlewareFixture implements CallReceivedMiddlewareContract {
    static readonly response = ServiceResponse.of(Status.permissionDenied('short circuit'));

    callReceived(call: ServiceCallContract): Promise<CallReceivedResult> {
        return Promise.resolve(new CallReceivedResult(call, ShortCircuitCallReceivedMiddlewareFixture.response));
    }
}
