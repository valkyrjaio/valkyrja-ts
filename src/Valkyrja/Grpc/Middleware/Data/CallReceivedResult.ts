/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';

export class CallReceivedResult {
    readonly call: ServiceCallContract;
    readonly response: ServiceResponseContract | null;

    constructor(call: ServiceCallContract, response: ServiceResponseContract | null = null) {
        this.call = call;
        this.response = response;
    }
}
