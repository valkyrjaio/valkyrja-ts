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

/**
 * The shared cancellation check applied at every orchestrator boundary — the "two-question pattern".
 *
 * Asks: (1) has cancellation fired on the call, or the deadline elapsed? (2) does the response in
 * hand already carry a cancellation status? If either is true, a cancellation response is returned
 * to fast-exit up the stack; otherwise `null` signals "continue normally".
 *
 * Pre-check (before delegation): a fired cancellation either overlays the existing response's status
 * (preserving accumulated metadata) or, when no response exists yet, builds a fresh one. Post-check
 * (after delegation): a returned cancellation response passes through unchanged.
 */
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
