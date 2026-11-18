/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ServiceResponse } from '../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Status } from '../../../../../src/Valkyrja/Grpc/Message/Status/Status.ts';

import type { ServiceResponseContract } from '../../../../../src/Valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../../../../../src/Valkyrja/Grpc/Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';

/** Converts a caught throwable into a domain response of its own choosing. */
export class RespondingThrowableCaughtMiddlewareFixture implements ThrowableCaughtMiddlewareContract {
    static readonly response = ServiceResponse.of(Status.invalidArgument('caught'));

    throwableCaught(): Promise<ServiceResponseContract> {
        return Promise.resolve(RespondingThrowableCaughtMiddlewareFixture.response);
    }
}
