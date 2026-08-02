/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../../../../src/Valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../../../src/Valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { ResponseSentMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/ResponseSentMiddlewareContract.ts';

/** Records that the after-the-wire stage ran, and for which call. */
export class RecordingResponseSentMiddlewareFixture implements ResponseSentMiddlewareContract {
    static readonly sent: string[] = [];

    responseSent(call: ServiceCallContract, _response: ServiceResponseContract): Promise<void> {
        RecordingResponseSentMiddlewareFixture.sent.push(call.getMethod());

        return Promise.resolve();
    }
}
