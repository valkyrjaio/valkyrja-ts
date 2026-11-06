/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ServiceResponse } from '../Message/Response/ServiceResponse.ts';

import type { ServiceCallContract } from '../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../Message/Response/Contract/ServiceResponseContract.ts';

export class Cancellation {
    /**
     * Run the two-question check.
     *
     * @return a cancellation response to fast-exit with, or null to continue normally
     */
    static checkAndFinalize(
        call: ServiceCallContract,
        response: ServiceResponseContract | null = null,
    ): ServiceResponseContract | null {
        if (call.getCancellation().isCancelled()) {
            const reason = call.getCancellation().getReason();

            if (response !== null) {
                return response.withStatus(ServiceResponse.statusForReason(reason));
            }

            return ServiceResponse.cancelled(reason);
        }

        if (response !== null && response.isCancellation()) {
            return response;
        }

        return null;
    }
}
