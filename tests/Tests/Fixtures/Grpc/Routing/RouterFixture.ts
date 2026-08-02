/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ServiceResponse } from '../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';

import type { ServiceCallContract } from '../../../../../src/Valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../../../src/Valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { RouterContract } from '../../../../../src/Valkyrja/Grpc/Routing/Dispatcher/Contract/RouterContract.ts';

/**
 * A router double that records the call it received and answers with a canned response — or throws,
 * so the kernel's throwable-to-status mapping can be driven without a real route.
 */
export class RouterFixture implements RouterContract {
    dispatched: ServiceCallContract | null = null;

    constructor(
        protected readonly response: ServiceResponseContract = ServiceResponse.ok(),
        protected readonly throwable: Error | null = null,
    ) {}

    dispatch(call: ServiceCallContract): Promise<ServiceResponseContract> {
        this.dispatched = call;

        if (this.throwable !== null) {
            return Promise.reject(this.throwable);
        }

        return Promise.resolve(this.response);
    }

    /** A router that always throws the given throwable. */
    static throwing(throwable: Error): RouterFixture {
        return new RouterFixture(ServiceResponse.ok(), throwable);
    }
}
