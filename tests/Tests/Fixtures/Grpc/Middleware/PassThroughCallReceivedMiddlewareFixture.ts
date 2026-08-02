/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../../../../src/Valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { CallReceivedMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/CallReceivedMiddlewareContract.ts';
import type { CallReceivedResult } from '../../../../../src/Valkyrja/Grpc/Middleware/Data/CallReceivedResult.ts';
import type { CallReceivedHandlerContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Handler/Contract/CallReceivedHandlerContract.ts';

/** Continues the chain unchanged, so the handler walks on to the next middleware. */
export class PassThroughCallReceivedMiddlewareFixture implements CallReceivedMiddlewareContract {
    async callReceived(call: ServiceCallContract, handler: CallReceivedHandlerContract): Promise<CallReceivedResult> {
        return handler.callReceived(call);
    }
}
