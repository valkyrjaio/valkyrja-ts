/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Message/Response/Contract/ServiceResponseContract.ts';

/**
 * The outcome of the `CallReceived` stage: either the (possibly updated) call to continue routing,
 * or a response that short-circuits the pipeline.
 */
export class CallReceivedResult {
    readonly call: ServiceCallContract;
    readonly response: ServiceResponseContract | null;

    constructor(call: ServiceCallContract, response: ServiceResponseContract | null = null) {
        this.call = call;
        this.response = response;
    }
}
